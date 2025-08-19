import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { renderReactToElement } from '@frankjhub/shared-ui-core';
import { CustomLocationMarker } from './CustomLocationMarker';
import { CustomPopup, POPUP_ROOT_SELECTOR, POPUP_SELECTED_ATTR } from './CustomPopup';
import { createPopupOverlayClass, PopupOverlayCtor } from './PopupOverlay';

export interface FrankGoogleMapAddress {
  id: string;
  address: string;
  label?: string;
  image?: string;
  link?: string;
}

export interface FrankGoogleMapProps {
  googleMapApiKey: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
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

const Z = {
  BASE: undefined as number | undefined, // 还原默认：按屏幕纵向排序
  SELECTED: 2_000_000, // 选中时置顶
  HOVERED: 2_000_001, // hover 比选中更靠前
};

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
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const animVersionRef = useRef(0);

  type MarkerItem = {
    marker: google.maps.marker.AdvancedMarkerElement;
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    resetHover: () => void;
    hover: () => void;
    select: () => void;
    resetSelect: () => void;
    cleanup: () => void;
  };
  const markerIndexRef = useRef<Map<string, MarkerItem>>(new Map());
  const currentHoveredIdRef = useRef<string | null>(null);
  const currentSelectedIdRef = useRef<string | null>(null);

  // Overlay（自定义弹窗）
  const overlayCtorRef = useRef<PopupOverlayCtor | null>(null);
  const overlayRef = useRef<InstanceType<PopupOverlayCtor> | null>(null);
  const overlayRootRef = useRef<Root | null>(null);
  const lastSelectionRef = useRef<{ id: string | null; tick: number }>({ id: null, tick: -1 });

  const mergedOptions = useMemo<google.maps.MapOptions>(() => {
    return {
      center: center ?? { lat: 43.6532, lng: -79.3832 },
      zoom,
      disableDefaultUI: false,
      mapId:
        (mapOptions && (mapOptions as unknown as { mapId?: string }).mapId) ||
        (typeof googleMapId === 'string' ? googleMapId : undefined),
      ...mapOptions,
    };
  }, [center, zoom, mapOptions, googleMapId]);

  // 把各种 LatLng 类型统一成 google.maps.LatLng
  const toLatLng = (pos: google.maps.LatLng | google.maps.LatLngLiteral) =>
    pos instanceof google.maps.LatLng ? pos : new google.maps.LatLng(pos.lat, pos.lng);

  /** 判断一个点是否在当前视野；paddingPx > 0 时使用像素内边距 */
  const isPositionInViewport = useCallback(
    (pos: google.maps.LatLng | google.maps.LatLngLiteral, paddingPx = 0) => {
      const map = mapRef.current;
      if (!map) return false;

      const bounds = map.getBounds();
      if (!bounds) return false; // 视野还没就绪时，认为不在视野内，触发一次 pan

      const latLng = toLatLng(pos);

      // 无 padding：直接用 bounds.contains
      if (paddingPx <= 0) return bounds.contains(latLng);

      // 有 padding：用 OverlayView 的投影做像素级判断（fallback 到 contains）
      const projection = overlayRef.current?.getProjection?.();
      if (!projection) return bounds.contains(latLng);

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const nePx = projection.fromLatLngToDivPixel(ne);
      const swPx = projection.fromLatLngToDivPixel(sw);
      const pt = projection.fromLatLngToDivPixel(latLng);
      if (!nePx || !swPx || !pt) return bounds.contains(latLng);

      // 当前视窗的像素矩形（注意 y 轴向下增加）：
      // left = sw.x, right = ne.x, top = ne.y, bottom = sw.y
      const left = swPx.x + paddingPx;
      const right = nePx.x - paddingPx;
      const top = nePx.y + paddingPx;
      const bottom = swPx.y - paddingPx;

      return pt.x >= left && pt.x <= right && pt.y >= top && pt.y <= bottom;
    },
    []
  );

  /** 仅在超出（带 padding 的）视野时才 pan */
  const panIfNeeded = useCallback(
    (pos: google.maps.LatLng | google.maps.LatLngLiteral, paddingPx = 0) => {
      const map = mapRef.current;
      if (!map) return;

      const latLng = toLatLng(pos);
      const inView = isPositionInViewport(latLng, paddingPx);
      if (!inView) {
        map.panTo(latLng);
      }
    },
    [isPositionInViewport]
  );
  // ---------- Hover/Select 状态 ----------
  const clearHoverOnly = useCallback(() => {
    const hoveredId = currentHoveredIdRef.current;
    if (hoveredId) {
      const item = markerIndexRef.current.get(hoveredId);
      if (item) item.resetHover();
      currentHoveredIdRef.current = null;
    }
  }, []);

  const clearSelectOnly = useCallback(() => {
    const selectedId = currentSelectedIdRef.current;
    if (selectedId) {
      const item = markerIndexRef.current.get(selectedId);
      if (item) item.resetSelect();
      currentSelectedIdRef.current = null;
    }
  }, []);

  const hoverHighLight = useCallback((id: string, pan = false) => {
    const item = markerIndexRef.current.get(id);
    const map = mapRef.current;
    if (!item || !map) return;

    const prevId = currentHoveredIdRef.current;
    if (prevId && prevId !== id) {
      const prevItem = markerIndexRef.current.get(prevId);
      if (prevItem) prevItem.resetHover();
    }

    item.hover();
    if (pan) {
      const pos = item.marker.position as google.maps.LatLng | null;
      if (pos) map.panTo(pos);
    }
    currentHoveredIdRef.current = id;
  }, []);

  const selectHighLight = useCallback(
    (id: string, pan = true) => {
      // 清掉 hover，防止 hover 与 selected 同时变更导致过渡重复
      const hoveredId = currentHoveredIdRef.current;
      if (hoveredId && hoveredId !== id) {
        const prev = markerIndexRef.current.get(hoveredId);
        prev?.resetHover();
        currentHoveredIdRef.current = null;
      }

      const item = markerIndexRef.current.get(id);
      const map = mapRef.current;
      if (!item || !map) return;

      const prevId = currentSelectedIdRef.current;
      if (prevId && prevId !== id) {
        const prevItem = markerIndexRef.current.get(prevId);
        if (prevItem) prevItem.resetSelect();
      }

      item.select();
      if (pan) {
        const pos = item.marker.position as google.maps.LatLng | null;
        if (pos) panIfNeeded(pos, 48);
      }
      currentSelectedIdRef.current = id;
    },
    [panIfNeeded]
  );

  // ---------- Overlay 相关 ----------
  const ensureOverlayCtor = useCallback(() => {
    if (!overlayCtorRef.current) {
      overlayCtorRef.current = createPopupOverlayClass();
    }
  }, []);

  const ensureOverlayInstance = useCallback(() => {
    if (!overlayRef.current) {
      if (!overlayCtorRef.current) ensureOverlayCtor();
      const Ctor = overlayCtorRef.current;
      if (Ctor) {
        const instance = new Ctor();
        overlayRef.current = instance;
        const map = mapRef.current;
        if (map) {
          instance.attachToMap(map);
          instance.setOffset({ x: 0, y: 130 });
          // root 只创建一次
          const inner = instance.getInnerContainer();
          if (!overlayRootRef.current) {
            overlayRootRef.current = createRoot(inner);
          }
        }
      }
    } else {
      // 如果已经有 overlay，但还没 root（极少数情况），补创建
      const inner = overlayRef.current.getInnerContainer();
      if (!overlayRootRef.current) {
        overlayRootRef.current = createRoot(inner);
      }
    }
  }, [ensureOverlayCtor]);

  // 清空 overlay 内容
  const clearOverlayContent = useCallback(() => {
    const root = overlayRootRef.current;
    if (root) {
      // 安全清空：不要在渲染过程中同步 unmount 根
      root.render(null);
    }
  }, []);

  // 显示新内容并淡入
  const showPopupFor = useCallback(
    (id: string) => {
      const map = mapRef.current;
      if (!map) return;

      ensureOverlayInstance();
      const overlay = overlayRef.current;
      const root = overlayRootRef.current;
      if (!overlay || !root) return;

      overlay.attachToMap(map);
      overlay.setVisible(true);

      const inner = overlay.getInnerContainer() as HTMLElement;

      const item = markerIndexRef.current.get(id);
      if (!item) return;

      // 1) 渲染“隐藏态”的卡片（selected={false}）
      const addr = addresses.find(a => a.id === id);
      root.render(
        <div className="w-[200px] h-[140px]">
          <CustomPopup
            selected={false} // ★ 初始为 0（opacity:0, translate-y）
            address={addr?.address}
            label={addr?.label}
            image={addr?.image}
            link={addr?.link}
          />
        </div>
      );

      // 2) 等新节点挂上去，再触发 0→1
      const myVer = ++animVersionRef.current;

      const waitForMount = () => {
        if (myVer !== animVersionRef.current) return;
        const popupRoot = inner.querySelector(POPUP_ROOT_SELECTOR) as HTMLElement | null;
        if (!popupRoot) {
          // 这一帧还没插进来，下一帧再查
          requestAnimationFrame(waitForMount);
          return;
        }

        // 明确处于 0 态（即使 React 已经写了，也再写一次），并强制 reflow
        popupRoot.setAttribute(POPUP_SELECTED_ATTR, 'false');
        void popupRoot.offsetWidth;

        // 第一帧：什么都不做，让浏览器以 0 态真正绘制一次
        requestAnimationFrame(() => {
          if (myVer !== animVersionRef.current) return;
          // 第二帧：切换到 1，触发 0.5s 过渡
          requestAnimationFrame(() => {
            if (myVer !== animVersionRef.current) return;
            // 取一次最新节点（极端情况下节点被替换）
            const rootEl =
              (inner.querySelector(POPUP_ROOT_SELECTOR) as HTMLElement | null) ?? popupRoot;
            if (!rootEl) return;
            rootEl.setAttribute(POPUP_SELECTED_ATTR, 'true');
          });
        });
      };

      requestAnimationFrame(waitForMount);

      // 定位与选中高亮照旧
      const pos = item.marker.position as google.maps.LatLng | null;
      if (pos) {
        overlay.setPosition(pos);
        panIfNeeded(pos, 48);
      }
      selectHighLight(id, true);
    },
    [addresses, ensureOverlayInstance, selectHighLight, panIfNeeded]
  );
  const closeOverlay = useCallback(() => {
    clearOverlayContent(); // 直接清掉
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.setVisible(false); // 立即隐藏
    }
  }, [clearOverlayContent]);

  // ---------- 初始化地图与标记 ----------
  useEffect(() => {
    let cancelled = false;

    const mapForCleanup = markerIndexRef.current;

    async function init() {
      const el = containerRef.current;
      if (!el) return;

      const loader = getLoader(googleMapApiKey);
      const mapsLib = await loader.importLibrary('maps').catch(() => null);
      const markerLib = await loader.importLibrary('marker').catch(() => null);
      const geocodeLib = await loader.importLibrary('geocoding').catch(() => null);
      if (cancelled || !mapsLib || !markerLib || !geocodeLib) return;

      const { Map } = mapsLib as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = markerLib as google.maps.MarkerLibrary;
      const { Geocoder } = geocodeLib as google.maps.GeocodingLibrary;

      const CB = google.maps.CollisionBehavior;

      if (!mapRef.current) {
        mapRef.current = new Map(el, mergedOptions);
        geocoderRef.current = new Geocoder();
      } else {
        mapRef.current.setOptions(mergedOptions);
      }

      // SDK 已就绪，提前挂 Overlay，确保首次点击不丢首帧
      ensureOverlayCtor();
      ensureOverlayInstance();

      const map = mapRef.current;
      const geocoder = geocoderRef.current;
      if (!map || !geocoder) return;

      const mapListeners: google.maps.MapsEventListener[] = [];

      mapListeners.push(
        map.addListener('click', () => {
          clearHoverOnly();
          clearSelectOnly();
          closeOverlay();
        })
      );
      mapListeners.push(map.addListener('dragstart', () => clearHoverOnly()));
      mapListeners.push(map.addListener('zoom_changed', () => clearHoverOnly()));

      // 清旧标记
      const prev = Array.from(markerIndexRef.current.values());
      prev.forEach(({ marker }) => {
        marker.map = null;
      });
      markerIndexRef.current.clear();
      currentHoveredIdRef.current = null;

      if (!addresses || addresses.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      const geocodeResults = await Promise.allSettled(
        addresses.map(a =>
          geocoder.geocode({ address: a.address }).then(res => ({ input: a, res }))
        )
      );

      for (const result of geocodeResults) {
        if (result.status !== 'fulfilled') continue;
        const value = result.value;
        if (!value) continue;

        const { input, res } = value;
        const first = res.results?.[0];
        if (!first) continue;

        const position = first.geometry.location;
        bounds.extend(position);

        const markerNode = renderReactToElement(<CustomLocationMarker />);
        const root = markerNode.el;
        const host =
          (root.matches('[data-marker-root]') ? root : root.querySelector('[data-marker-root]')) ||
          (root.matches('.group') ? root : root.querySelector('.group'));
        const hostEl = (host as HTMLElement) ?? root;

        const marker = new AdvancedMarkerElement({
          map,
          position,
          title: input.label || input.address,
          content: hostEl,
          collisionBehavior: CB.REQUIRED,
        });

        marker.addListener('click', () => {
          // 点击与外部选择统一走 showPopupFor（瞬间替换→淡入）
          showPopupFor(input.id);
        });

        const setHover = (on: boolean) => {
          if (!hostEl) return;
          hostEl.setAttribute('data-hovered', on ? 'true' : 'false');
          marker.zIndex = on
            ? Z.HOVERED
            : currentSelectedIdRef.current === input.id
            ? Z.SELECTED
            : Z.BASE;
        };
        const setSelect = (on: boolean) => {
          if (!hostEl) return;
          hostEl.setAttribute('data-selected', on ? 'true' : 'false');
          marker.zIndex = on
            ? Z.SELECTED
            : currentHoveredIdRef.current === input.id
            ? Z.HOVERED
            : Z.BASE;
        };

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

      if (!bounds.isEmpty()) {
        if (markerIndexRef.current.size === 1) {
          map.setCenter(bounds.getCenter());
          map.setZoom(zoom);
        } else {
          map.fitBounds(bounds);
        }
      }
    }

    init();

    return () => {
      cancelled = true;

      try {
        if (overlayRootRef.current) overlayRootRef.current.unmount();
      } catch {
        /* ignore */
      }
      overlayRootRef.current = null;

      if (overlayRef.current) {
        overlayRef.current.attachToMap(null);
        overlayRef.current = null;
      }

      const snapshot = Array.from(mapForCleanup.values());
      snapshot.forEach(item => {
        item.marker.map = null;
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
    showPopupFor,
    ensureOverlayCtor,
    ensureOverlayInstance,
    closeOverlay,
  ]);

  // ---------- 监听 hover ----------
  useEffect(() => {
    if (!hoveredAddressId) {
      const prevId = currentHoveredIdRef.current;
      if (prevId) {
        const prevItem = markerIndexRef.current.get(prevId);
        if (prevItem) prevItem.resetHover();
        currentHoveredIdRef.current = null;
      }
      return;
    }
    if (currentHoveredIdRef.current === hoveredAddressId) return;
    hoverHighLight(hoveredAddressId, false);
  }, [hoveredAddressId, hoverHighLight]);

  // ---------- 监听 select（瞬间替换→淡入） ----------
  useEffect(() => {
    // 空：清理状态
    if (!selectedAddressId) {
      const prevId = currentSelectedIdRef.current;
      if (prevId) {
        const prevItem = markerIndexRef.current.get(prevId);
        if (prevItem) prevItem.resetSelect();
        currentSelectedIdRef.current = null;
      }
      lastSelectionRef.current = { id: null, tick: -1 };
      closeOverlay();
      return;
    }

    // ✅ 去重：同一 {id, tick} 已处理过就不再触发
    const last = lastSelectionRef.current;
    if (last.id === selectedAddressId && last.tick === selectedTick) {
      return;
    }
    lastSelectionRef.current = { id: selectedAddressId, tick: selectedTick };

    // 统一入口（点击与外部传入一致）
    showPopupFor(selectedAddressId);
  }, [selectedAddressId, selectedTick, showPopupFor, closeOverlay]);

  return (
    <div
      className={className}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
