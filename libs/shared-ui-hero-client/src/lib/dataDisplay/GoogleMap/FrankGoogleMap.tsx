import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { escape } from 'lodash';
import { renderReactToElement } from '@frankjhub/shared-ui-core';
import { CustomLocationMarker } from './CustomLocationMarker';

export interface FrankGoogleMapAddress {
  id: string;

  // 要渲染的地址字符串，例如 "1600 Amphitheatre Parkway, Mountain View, CA"
  address: string;

  // 标记点 InfoWindow 的标题或说明
  label?: string;
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
  googleMapId?: string;
  width?: number;
  height?: number;
  activeAddressId?: string | null;
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
  activeAddressId,
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
        contentHtml: string;
        resetHighlight: () => void;
        highlight: () => void;
        cleanup: () => void;
      }
    >
  >(new Map());

  // 记录当前已高亮/打开的 id，方便复原
  const currentActiveIdRef = useRef<string | null>(null);

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

  // 高亮
  const openAndHighlight = useCallback((id: string, pan = true) => {
    const item = markerIndexRef.current.get(id);
    if (!item || !mapRef.current || !infoWindowRef.current) return;

    // 复原上一个
    if (currentActiveIdRef.current && currentActiveIdRef.current !== id) {
      const prev = markerIndexRef.current.get(currentActiveIdRef.current);
      prev?.resetHighlight();
    }

    // 高亮当前 & 开窗
    item.highlight();
    // infoWindowRef.current.setContent(item.contentHtml);
    // infoWindowRef.current.open(mapRef.current, item.marker);
    if (pan) mapRef.current.panTo(item.marker.position as google.maps.LatLng);

    currentActiveIdRef.current = id;
  }, []);

  const highlightById = useCallback((id: string) => openAndHighlight(id, true), [openAndHighlight]);

  // 清空
  // 1) 通用清空方法
  const clearActive = useCallback(() => {
    // 复原高亮
    if (currentActiveIdRef.current) {
      const prev = markerIndexRef.current.get(currentActiveIdRef.current);
      prev?.resetHighlight();
      currentActiveIdRef.current = null;
    }
    // 关窗
    infoWindowRef.current?.close();
  }, []);

  useEffect(() => {
    let cancelled = false;

    // 专供 cleanup 使用
    const mapForCleanup = markerIndexRef.current;

    async function init() {
      if (!containerRef.current) return;

      const loader = getLoader(googleMapApiKey);

      const { Map, InfoWindow } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;
      const { Geocoder } = (await loader.importLibrary(
        'geocoding'
      )) as google.maps.GeocodingLibrary;
      // const { LatLngBounds } = (await loader.importLibrary('core')) as google.maps.CoreLibrary;

      if (cancelled) return;

      // 初始化 Map
      if (!mapRef.current) {
        mapRef.current = new Map(containerRef.current, mergedOptions);
        infoWindowRef.current = new InfoWindow();
        geocoderRef.current = new Geocoder();
      } else {
        mapRef.current.setOptions(mergedOptions);
      }

      const mapListeners: google.maps.MapsEventListener[] = [];

      // 点击地图任意位置(不点 Marker 时)清空
      mapListeners.push(
        mapRef.current.addListener('click', () => {
          clearActive();
        })
      );

      // 拖动或缩放也顺便清空（可选）
      mapListeners.push(
        mapRef.current.addListener('dragstart', () => {
          clearActive();
        })
      );
      mapListeners.push(
        mapRef.current.addListener('zoom_changed', () => {
          clearActive();
        })
      );

      // InfoWindow 右上角关闭按钮被点时，顺带把高亮复位（可选）
      let iwCloseListener = undefined;
      if (infoWindowRef.current) {
        iwCloseListener = infoWindowRef.current.addListener('closeclick', () => {
          clearActive();
        });
      }

      // 清除旧标记
      const prevMarkersSnapshot = Array.from(markerIndexRef.current.values());
      prevMarkersSnapshot.forEach(({ marker }) => (marker.map = null));
      markerIndexRef.current.clear();
      currentActiveIdRef.current = null;
      infoWindowRef.current?.close();

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

        // 基础 InfoWindow 内容
        const contentHtml = `<div style="max-width:240px">
              <strong>${escape(input.label || 'Location')}</strong>
              <div style="margin-top:4px">${escape(first.formatted_address || input.address)}</div>
            </div>`;

        const markerNode = renderReactToElement(<CustomLocationMarker />);
        const root = markerNode.el;
        // 找到真正带 data-active 的元素（避免 renderReactToElement 包了一层）
        const activeHost = (
          root.matches('[data-active]') ? root : root.querySelector('[data-active]')
        ) as HTMLElement;

        // 创建 AdvancedMarkerElement
        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position,
          title: input.label || input.address,
          content: root,
        });

        // 点击开窗
        marker.addListener('click', () => {
          infoWindowRef.current?.setContent(contentHtml);
          infoWindowRef.current?.open(mapRef.current, marker);
          // 同步高亮状态给当前 id
          highlightById(input.id);
        });

        // 定义高亮/还原
        const highlight = () => {
          activeHost.setAttribute('data-active', 'true');
        };
        const resetHighlight = () => {
          activeHost.setAttribute('data-active', 'false');
        };

        // 清理
        const disposers: Array<() => void> = [
          markerNode.unmount,
          () => {
            mapListeners.forEach(l => l.remove());
          },
          () => {
            iwCloseListener?.remove?.();
          },
        ];

        markerIndexRef.current.set(input.id, {
          marker,
          position,
          contentHtml,
          resetHighlight,
          highlight,
          cleanup: () => {
            // 先关窗，避免持有DOM
            if (infoWindowRef.current) infoWindowRef.current.close();
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
      // ✅ 使用上面快照到的 mapForCleanup，而不是 markerIndexRef.current
      const markersSnapshot = Array.from(mapForCleanup.values());
      markersSnapshot.forEach(item => {
        item.marker.map = null;
        item.cleanup();
      });
      mapForCleanup.clear();
    };
  }, [googleMapApiKey, mergedOptions, addresses, zoom, highlightById, clearActive]);

  // 监听activeAddressId
  useEffect(() => {
    if (!activeAddressId) {
      // 清空高亮/关闭窗
      if (currentActiveIdRef.current) {
        const prev = markerIndexRef.current.get(currentActiveIdRef.current);
        prev?.resetHighlight();
        currentActiveIdRef.current = null;
      }
      infoWindowRef.current?.close();
      return;
    }
    // 如果已经是当前高亮，直接跳过（避免重复工作）
    if (currentActiveIdRef.current === activeAddressId) return;
    openAndHighlight(activeAddressId, true);
  }, [activeAddressId, openAndHighlight]);

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
