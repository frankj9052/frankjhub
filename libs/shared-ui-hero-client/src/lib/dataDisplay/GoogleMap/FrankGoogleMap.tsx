import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { renderReactToElement } from '@frankjhub/shared-ui-core';
import { CustomLocationMarker } from './CustomLocationMarker';
import { CustomPopup } from './CustomPopup';

export interface FrankGoogleMapAddress {
  id: string;

  // 要渲染的地址字符串，例如 "1600 Amphitheatre Parkway, Mountain View, CA"
  address: string;

  // 标记点 InfoWindow 的标题或说明
  label?: string;
  image?: string;
}

export interface FrankGoogleMapProps {
  googleMapApiKey: string;

  // 初始中心点（若不传且有地址，会根据所有标记自适应视野）
  center?: google.maps.LatLngLiteral;

  // 初始缩放级别（当没有地址或只有一个地址时生效更明显）
  zoom?: number;

  // 额外的 MapOptions（例如禁用UI、样式等）
  mapOptions?: google.maps.MapOptions;
  addresses: FrankGoogleMapAddress[];
  className?: string;
  googleMapId: string;
  width?: number;
  height?: number;
  hoveredAddressId?: string | null;
  selectedAddressId?: string | null;
  selectedTick?: number;
}

const getLoader = (() => {
  let _loader: Loader | null = null;
  return (apiKey: string) => {
    if (_loader) return _loader;
    _loader = new Loader({
      apiKey,
      libraries: ['places', 'marker'],
    });
    return _loader;
  };
})();

export const FrankGoogleMap = ({
  googleMapApiKey,
  center,
  zoom = 11,
  mapOptions,
  addresses,
  className,
  googleMapId,
  width,
  height,
  hoveredAddressId,
  selectedAddressId,
  selectedTick = 0,
}: FrankGoogleMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // id => marker 映射 & 高亮恢复句柄
  const markerIndexRef = useRef<
    Map<
      string,
      {
        marker: google.maps.marker.AdvancedMarkerElement;
        position: google.maps.LatLng | google.maps.LatLngLiteral;
        resetHover: () => void;
        hover: () => void;
        select: () => void;
        resetSelect: () => void;
        infoContentEl?: HTMLElement;
        infoUnmount?: () => void;
        cleanup: () => void;
      }
    >
  >(new Map());

  // 当前 hover / select 的 id（互不影响）
  const currentHoveredIdRef = useRef<string | null>(null);
  const currentSelectedIdRef = useRef<string | null>(null);

  const mergedOptions = useMemo<google.maps.MapOptions>(() => {
    return {
      center: center ?? { lat: 43.6532, lng: -79.3832 }, // 默认多伦多,
      zoom,
      disableDefaultUI: false,
      mapId:
        (mapOptions && (mapOptions as any).mapId) ||
        (typeof googleMapId === 'string' ? googleMapId : undefined),
      ...mapOptions,
    };
  }, [center, zoom, mapOptions, googleMapId]);

  // 仅清除 hover（不清除 select）
  const clearHoverOnly = useCallback(() => {
    if (currentHoveredIdRef.current) {
      markerIndexRef.current.get(currentHoveredIdRef.current)?.resetHover();
      currentHoveredIdRef.current = null;
    }
  }, []);

  const clearSelectOnly = useCallback(() => {
    if (currentSelectedIdRef.current) {
      markerIndexRef.current.get(currentSelectedIdRef.current)?.resetSelect();
      currentSelectedIdRef.current = null;
    }
    infoWindowRef.current?.close();
  }, []);

  // 触发 hover 高亮（默认不 pan，避免频繁抖动；如需可传 true）
  const hoverHighLight = useCallback((id: string, pan = false) => {
    const item = markerIndexRef.current.get(id);
    if (!item || !mapRef.current) return;

    if (currentHoveredIdRef.current && currentHoveredIdRef.current !== id) {
      markerIndexRef.current.get(currentHoveredIdRef.current)?.resetHover();
    }
    item.hover();
    if (pan) mapRef.current.panTo(item.marker.position as google.maps.LatLng);
    currentHoveredIdRef.current = id;
  }, []);

  // 触发 select 高亮（panTo 定位，让用户看到）
  const selectHighLight = useCallback((id: string, pan = true) => {
    const item = markerIndexRef.current.get(id);
    if (!item || !mapRef.current) return;

    // 取消之前的 select
    if (currentSelectedIdRef.current && currentSelectedIdRef.current !== id) {
      markerIndexRef.current.get(currentSelectedIdRef.current)?.resetSelect();
    }

    item.select();
    if (pan) mapRef.current.panTo(item.marker.position as google.maps.LatLng);
    currentSelectedIdRef.current = id;
  }, []);

  // 打开infoWindow
  const openInfoWindow = useCallback((id: string) => {
    const item = markerIndexRef.current.get(id);
    if (!item || !mapRef.current) return;

    // 首次全局创建 InfoWindow
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow({
        // 调位置
        pixelOffset: new google.maps.Size(0, 144),
        // maxWidth: 260,
        // disableAutoPan: false,
        headerDisabled: true,
      });
    }

    // 等infoWindow DOM 挂好后再修改内部样式
    infoWindowRef.current.addListener('domready', () => {
      const mapEl = containerRef.current;
      if (!mapEl) return;

      // 隐藏原生三角箭头(tail)
      const tails = mapEl.querySelectorAll<HTMLElement>('.gm-style-iw-tc');
      tails.forEach(el => (el.style.display = 'none'));

      // 去掉默认padding
      const content = mapEl.querySelector<HTMLElement>('.gm-style-iw-c');
      if (content) {
        content.style.padding = '0';
        // 避免内容被裁剪
        content.style.overflow = 'visible';
      }
    });

    // InfoWindow内容
    const infoContent = renderReactToElement(<CustomPopup />);
    item.infoContentEl = infoContent.el;
    item.infoUnmount = infoContent.unmount;

    // 绑定内容并打开
    infoWindowRef.current.setContent(item.infoContentEl);
    infoWindowRef.current.open({
      map: mapRef.current,
      anchor: item.marker,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    // 专供 cleanup 使用
    const mapForCleanup = markerIndexRef.current;

    async function init() {
      if (!containerRef.current) return;

      const loader = getLoader(googleMapApiKey);

      const { Map } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;
      const { Geocoder } = (await loader.importLibrary(
        'geocoding'
      )) as google.maps.GeocodingLibrary;

      if (cancelled) return;

      // 初始化 Map
      if (!mapRef.current) {
        mapRef.current = new Map(containerRef.current, mergedOptions);
        geocoderRef.current = new Geocoder();
      } else {
        mapRef.current.setOptions(mergedOptions);
      }

      // 地图交互: 清除 hover 和 select
      const mapListeners: google.maps.MapsEventListener[] = [];

      // 点击地图任意位置(不点 Marker 时)清空
      mapListeners.push(
        mapRef.current.addListener('click', () => {
          clearHoverOnly();
          clearSelectOnly();
        })
      );

      // 拖动或缩放也顺便清空（可选）
      mapListeners.push(
        mapRef.current.addListener('dragstart', () => {
          clearHoverOnly();
        })
      );
      mapListeners.push(
        mapRef.current.addListener('zoom_changed', () => {
          clearHoverOnly();
        })
      );

      // 清除旧标记
      const prevMarkersSnapshot = Array.from(markerIndexRef.current.values());
      prevMarkersSnapshot.forEach(({ marker }) => (marker.map = null));
      markerIndexRef.current.clear();
      currentHoveredIdRef.current = null;

      if (!addresses || addresses.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      const geocoder = geocoderRef.current;

      const results = await Promise.allSettled(
        addresses.map(a =>
          geocoder?.geocode({ address: a.address }).then(res => ({ input: a, res }))
        )
      );

      for (const result of results) {
        if (result.status !== 'fulfilled' || !result.value) continue;
        const { input, res } = result.value;
        const first = res.results?.[0];
        if (!first) continue;

        const position = first.geometry.location;
        bounds.extend(position);

        const markerNode = renderReactToElement(<CustomLocationMarker />);
        const root = markerNode.el;

        // 找到真正带 data-active 的元素（避免 renderReactToElement 包了一层）
        const host =
          (root.matches('[data-marker-root]') ? root : root.querySelector('[data-marker-root]')) ||
          (root.matches('.group') ? root : root.querySelector('.group'));

        const hostEl = host as HTMLElement;

        // 创建 AdvancedMarkerElement
        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position,
          title: input.label || input.address,
          content: hostEl ?? root,
        });

        // 添加点击事件
        marker.addListener('click', () => {
          selectHighLight(input.id, true);
          openInfoWindow(input.id);
        });

        // DOM状态控制
        const setHover = (on: boolean) => {
          if (!hostEl) return;
          if (on) hostEl.setAttribute('data-hovered', 'true');
          else hostEl.setAttribute('data-hovered', 'false');
        };
        const setSelect = (on: boolean) => {
          if (!hostEl) return;
          if (on) hostEl.setAttribute('data-selected', 'true');
          else {
            hostEl.setAttribute('data-selected', 'false');
          }
        };

        // 清理
        const disposers: Array<() => void> = [
          markerNode.unmount,
          () => {
            mapListeners.forEach(l => l.remove());
          },
        ];

        markerIndexRef.current.set(input.id, {
          marker,
          position,
          hover: () => setHover(true),
          resetHover: () => setHover(false),
          select: () => setSelect(true),
          resetSelect: () => setSelect(false),
          cleanup: () => {
            disposers.forEach(fn => fn());
          },
        });
      }

      // 调整视野
      if (!bounds.isEmpty()) {
        if (markerIndexRef.current.size === 1) {
          mapRef.current.setCenter(bounds.getCenter());
          mapRef.current.setZoom(zoom);
        } else {
          mapRef.current.fitBounds(bounds);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      infoWindowRef.current?.close();
      // ✅ 使用上面快照到的 mapForCleanup，而不是 markerIndexRef.current
      const markersSnapshot = Array.from(mapForCleanup.values());
      markersSnapshot.forEach(item => {
        item.marker.map = null;
        item.infoUnmount?.();
        item.cleanup();
      });
      mapForCleanup.clear();
    };
  }, [
    googleMapApiKey,
    mergedOptions,
    addresses,
    zoom,
    clearHoverOnly,
    clearSelectOnly,
    selectHighLight,
    openInfoWindow,
  ]);

  // 监听hoveredAddressId
  useEffect(() => {
    if (!hoveredAddressId) {
      // 清空高亮/关闭窗
      if (currentHoveredIdRef.current) {
        const prev = markerIndexRef.current.get(currentHoveredIdRef.current);
        prev?.resetHover();
        currentHoveredIdRef.current = null;
      }
      return;
    }
    // 如果已经是当前高亮，直接跳过（避免重复工作）
    if (currentHoveredIdRef.current === hoveredAddressId) return;
    hoverHighLight(hoveredAddressId, false);
  }, [hoveredAddressId, hoverHighLight]);

  // 监听selectedAddressId
  useEffect(() => {
    if (!selectedAddressId) {
      if (currentSelectedIdRef.current) {
        markerIndexRef.current.get(currentSelectedIdRef.current)?.resetSelect();
        currentSelectedIdRef.current = null;
      }
      infoWindowRef.current?.close();
      return;
    }

    selectHighLight(selectedAddressId, true);
    openInfoWindow(selectedAddressId);
  }, [selectedAddressId, selectHighLight, selectedTick, openInfoWindow]);

  return (
    <div
      className={className}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
