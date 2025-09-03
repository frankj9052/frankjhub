import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { createRoot, Root } from 'react-dom/client';
import { CustomLocationMarker } from './CustomLocationMarker';
import { CustomPopup, POPUP_ROOT_SELECTOR, POPUP_SELECTED_ATTR } from './CustomPopup';
import { createPopupOverlayClass, PopupOverlayCtor } from './PopupOverlay';

export interface FrankGoogleMapAddress {
  id: string;
  address: string;
  label?: string;
  image?: string;
  link?: string;
  rating?: number;
  user_ratings_total?: number;
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
  popupWindowWith?: number;
  popupWindowHeight?: number;
  linkLabel?: string;
}

const getLoader = (() => {
  let _loader: Loader | null = null;
  return (apiKey: string) => {
    if (_loader) return _loader;
    _loader = new Loader({ apiKey, libraries: ['places', 'marker'] });
    return _loader;
  };
})();

const Z = {
  BASE: undefined as number | undefined,
  SELECTED: 2_000_000,
  HOVERED: 2_000_001,
};

// —— 安全卸载：先 render(null)，再异步 unmount，避免“同步卸载”报错 ——
function safeUnmountRoot(root: Root | null) {
  if (!root) return;
  try {
    root.render(null);
  } catch (e) {
    void e;
  }
  setTimeout(() => {
    try {
      root.unmount();
    } catch (e) {
      void e;
    }
  }, 0);
}

const isDocHidden = () => (typeof document !== 'undefined' ? !!document.hidden : false);

// 新建容器并挂一个 React Root（给 Google Maps 的 content 用）
function mountReactToDiv(node: React.ReactNode) {
  const containerEl = document.createElement('div');
  const root = createRoot(containerEl);
  root.render(node);
  return { containerEl, root };
}

// 将 data-attr 写到 data-marker-root；若首帧找不到，做至多 2 次 rAF 重试
function setDataAttrWithRetry(
  getRootEl: () => HTMLElement | null,
  name: string,
  value: 'true' | 'false'
) {
  const trySet = (attempt: number) => {
    const el = getRootEl();
    if (el) {
      el.setAttribute(name, value);
    } else if (attempt < 2) {
      requestAnimationFrame(() => trySet(attempt + 1));
    }
  };
  trySet(0);
}

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
  popupWindowWith,
  popupWindowHeight,
  linkLabel,
}: FrankGoogleMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const animVersionRef = useRef(0);

  const initialHoveredIdRef = useRef<string | null>(hoveredAddressId ?? null);
  const initialSelectedIdRef = useRef<string | null>(selectedAddressId ?? null);

  type MarkerItem = {
    marker: google.maps.marker.AdvancedMarkerElement;
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    containerEl: HTMLElement; // 传给 Google 的 content 容器
    getRootEl: () => HTMLElement | null; // 惰性获取 [data-marker-root]
    resetHover: () => void;
    hover: () => void;
    select: () => void;
    resetSelect: () => void;
    cleanup: () => void;
  };

  const markerIndexRef = useRef<Map<string, MarkerItem>>(new Map());
  const currentHoveredIdRef = useRef<string | null>(null);
  const currentSelectedIdRef = useRef<string | null>(null);

  // Overlay
  const overlayCtorRef = useRef<PopupOverlayCtor | null>(null);
  const overlayRef = useRef<InstanceType<PopupOverlayCtor> | null>(null);
  const overlayRootRef = useRef<Root | null>(null);
  const lastSelectionRef = useRef<{ id: string | null; tick: number }>({ id: null, tick: -1 });

  // Map 级监听统一管理
  const mapListenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const mergedOptions = useMemo<google.maps.MapOptions>(() => {
    return {
      center: center ?? { lat: 43.6532, lng: -79.3832 },
      zoom,
      disableDefaultUI: false,
      gestureHandling: 'greedy', // 允许直接滚轮缩放，无需ctrl
      mapId:
        (mapOptions && (mapOptions as unknown as { mapId?: string }).mapId) ||
        (typeof googleMapId === 'string' ? googleMapId : undefined),
      ...mapOptions,
    };
  }, [center, zoom, mapOptions, googleMapId]);

  const toLatLng = (pos: google.maps.LatLng | google.maps.LatLngLiteral) =>
    pos instanceof google.maps.LatLng ? pos : new google.maps.LatLng(pos.lat, pos.lng);

  const isPositionInViewport = useCallback(
    (pos: google.maps.LatLng | google.maps.LatLngLiteral, paddingPx = 0) => {
      const map = mapRef.current;
      if (!map) return false;
      const bounds = map.getBounds();
      if (!bounds) return false;
      const latLng = toLatLng(pos);
      if (paddingPx <= 0) return bounds.contains(latLng);

      const projection = overlayRef.current?.getProjection?.();
      if (!projection) return bounds.contains(latLng);

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const nePx = projection.fromLatLngToDivPixel(ne);
      const swPx = projection.fromLatLngToDivPixel(sw);
      const pt = projection.fromLatLngToDivPixel(latLng);
      if (!nePx || !swPx || !pt) return bounds.contains(latLng);

      const left = swPx.x + paddingPx;
      const right = nePx.x - paddingPx;
      const top = nePx.y + paddingPx;
      const bottom = swPx.y - paddingPx;
      return pt.x >= left && pt.x <= right && pt.y >= top && pt.y <= bottom;
    },
    []
  );

  const panIfNeeded = useCallback(
    (pos: google.maps.LatLng | google.maps.LatLngLiteral, paddingPx = 0) => {
      const map = mapRef.current;
      if (!map) return;
      const latLng = toLatLng(pos);
      if (!isPositionInViewport(latLng, paddingPx)) {
        map.panTo(latLng);
      }
    },
    [isPositionInViewport]
  );

  // ---------- 仅操作 DOM 属性的状态切换（不重建地图） ----------
  const clearHoverOnly = useCallback(() => {
    const hoveredId = currentHoveredIdRef.current;
    if (!hoveredId) return;
    const item = markerIndexRef.current.get(hoveredId);
    if (item) item.resetHover(); // => data-hovered="false"
    currentHoveredIdRef.current = null;
  }, []);

  const clearSelectOnly = useCallback(() => {
    const selectedId = currentSelectedIdRef.current;
    if (!selectedId) return;
    const item = markerIndexRef.current.get(selectedId);
    if (item) item.resetSelect(); // => data-selected="false"
    currentSelectedIdRef.current = null;
  }, []);

  const hoverHighLight = useCallback((id: string, pan = false) => {
    const map = mapRef.current;
    if (!map) return;

    // 先把之前 hover 的恢复
    const prevId = currentHoveredIdRef.current;
    if (prevId && prevId !== id) {
      const prevItem = markerIndexRef.current.get(prevId);
      if (prevItem) prevItem.resetHover(); // => data-hovered="false"
    }

    const item = markerIndexRef.current.get(id);
    if (!item) return;

    item.hover(); // => data-hovered="true"
    if (pan) {
      const pos = item.marker.position as google.maps.LatLng | null;
      if (pos) map.panTo(pos);
    }
    currentHoveredIdRef.current = id;
  }, []);

  const selectHighLight = useCallback(
    (id: string, pan = true) => {
      const map = mapRef.current;
      if (!map) return;

      // 选中前清掉 hover（如果不是同一个 id）
      const hoveredId = currentHoveredIdRef.current;
      if (hoveredId && hoveredId !== id) {
        const prevHover = markerIndexRef.current.get(hoveredId);
        if (prevHover) prevHover.resetHover();
        currentHoveredIdRef.current = null;
      }

      // 取消旧选中
      const prevSelId = currentSelectedIdRef.current;
      if (prevSelId && prevSelId !== id) {
        const prevSel = markerIndexRef.current.get(prevSelId);
        if (prevSel) prevSel.resetSelect();
      }

      const item = markerIndexRef.current.get(id);
      if (!item) return;

      item.select(); // => data-selected="true"
      if (pan) {
        const pos = item.marker.position as google.maps.LatLng | null;
        if (pos) panIfNeeded(pos, 48);
      }
      currentSelectedIdRef.current = id;
    },
    [panIfNeeded]
  );

  // ---------- Overlay ----------
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
          const inner = instance.getInnerContainer();
          if (!overlayRootRef.current) {
            overlayRootRef.current = createRoot(inner);
          }
        }
      }
    } else if (!overlayRootRef.current) {
      const inner = overlayRef.current.getInnerContainer();
      overlayRootRef.current = createRoot(inner);
    }
  }, [ensureOverlayCtor]);

  const clearOverlayContent = useCallback(() => {
    const root = overlayRootRef.current;
    if (root) root.render(null);
  }, []);

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

      const addr = addresses.find(a => a.id === id);

      if (isDocHidden()) {
        root.render(
          <div className="w-[200px] h-[140px]">
            <CustomPopup
              selected
              address={addr?.address}
              label={addr?.label}
              image={addr?.image}
              link={addr?.link}
              width={popupWindowWith}
              height={popupWindowHeight}
              linkLabel={linkLabel}
              rating={addr?.rating}
              userRatingsTotal={addr?.user_ratings_total}
            />
          </div>
        );
        const pos = (item.marker.position as google.maps.LatLng | null) ?? null;
        if (pos) {
          overlay.setPosition(pos);
          panIfNeeded(pos, 48);
        }
        selectHighLight(id, true);
        return;
      }

      // 先渲染 selected=false，再两帧后置 true（做淡入）
      root.render(
        <div className="w-[200px] h-[140px]">
          <CustomPopup
            selected={false}
            address={addr?.address}
            label={addr?.label}
            image={addr?.image}
            link={addr?.link}
            width={popupWindowWith}
            height={popupWindowHeight}
            linkLabel={linkLabel}
            rating={addr?.rating}
            userRatingsTotal={addr?.user_ratings_total}
          />
        </div>
      );

      const myVer = ++animVersionRef.current;
      const waitForMount = () => {
        if (myVer !== animVersionRef.current) return;
        const popupRoot = inner.querySelector(POPUP_ROOT_SELECTOR) as HTMLElement | null;
        if (!popupRoot) {
          requestAnimationFrame(waitForMount);
          return;
        }
        popupRoot.setAttribute(POPUP_SELECTED_ATTR, 'false');
        void popupRoot.offsetWidth;
        requestAnimationFrame(() => {
          if (myVer !== animVersionRef.current) return;
          requestAnimationFrame(() => {
            if (myVer !== animVersionRef.current) return;
            const rootEl =
              (inner.querySelector(POPUP_ROOT_SELECTOR) as HTMLElement | null) ?? popupRoot;
            if (!rootEl) return;
            rootEl.setAttribute(POPUP_SELECTED_ATTR, 'true');
          });
        });
      };
      requestAnimationFrame(waitForMount);

      const pos = item.marker.position as google.maps.LatLng | null;
      if (pos) {
        overlay.setPosition(pos);
        panIfNeeded(pos, 48);
      }
      selectHighLight(id, true);
    },
    [
      addresses,
      ensureOverlayInstance,
      selectHighLight,
      panIfNeeded,
      popupWindowHeight,
      popupWindowWith,
      linkLabel,
    ]
  );

  const closeOverlay = useCallback(() => {
    clearOverlayContent();
    const overlay = overlayRef.current;
    if (overlay) overlay.setVisible(false);
  }, [clearOverlayContent]);

  // ---------- 初始化（不会跟随 hovered/selected 变化重建） ----------
  useEffect(() => {
    let cancelled = false;

    const mapForCleanup = markerIndexRef.current;

    async function init() {
      const el = containerRef.current;
      if (!el) return;

      const loader = getLoader(googleMapApiKey);
      const mapsLib = await loader.importLibrary('maps').catch(e => {
        void e;
        return null;
      });
      const markerLib = await loader.importLibrary('marker').catch(e => {
        void e;
        return null;
      });
      const geocodeLib = await loader.importLibrary('geocoding').catch(e => {
        void e;
        return null;
      });
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

      ensureOverlayCtor();
      ensureOverlayInstance();

      const map = mapRef.current;
      const geocoder = geocoderRef.current;
      if (!map || !geocoder || cancelled) return;

      // 移除旧监听
      for (const l of mapListenersRef.current) {
        try {
          l.remove();
        } catch (e) {
          void e;
        }
      }
      mapListenersRef.current = [];

      mapListenersRef.current.push(
        map.addListener('click', () => {
          clearHoverOnly();
          clearSelectOnly();
          closeOverlay();
        })
      );
      mapListenersRef.current.push(map.addListener('dragstart', () => clearHoverOnly()));
      mapListenersRef.current.push(map.addListener('zoom_changed', () => clearHoverOnly()));

      // 清旧标记
      for (const v of markerIndexRef.current.values()) {
        try {
          v.marker.map = null;
        } catch (e) {
          void e;
        }
      }
      markerIndexRef.current.clear();
      currentHoveredIdRef.current = null;
      currentSelectedIdRef.current = null;

      if (cancelled || !addresses?.length) return;

      const bounds = new google.maps.LatLngBounds();
      const geocodeResults = await Promise.allSettled(
        addresses.map(a =>
          geocoder.geocode({ address: a.address }).then(res => ({ input: a, res }))
        )
      );
      if (cancelled) return;

      const cleanedIds = new Set<string>();

      for (const result of geocodeResults) {
        if (cancelled) return;
        if (result.status !== 'fulfilled') continue;
        const { input, res } = result.value;
        const first = res.results?.[0];
        if (!first) continue;

        const position = first.geometry.location;
        bounds.extend(position);

        // 容器（作为 Google content） & React 根
        const { containerEl, root: markerRoot } = mountReactToDiv(
          <CustomLocationMarker image={input.image} />
        );

        // 惰性获取 data-marker-root（可能首帧还没挂载）
        let cachedRootEl: HTMLElement | null = null;
        const getRootEl = () => {
          if (cachedRootEl && cachedRootEl.isConnected) return cachedRootEl;
          const found =
            (containerEl.querySelector('[data-marker-root]') as HTMLElement | null) ||
            (containerEl.firstElementChild as HTMLElement | null) ||
            null;
          cachedRootEl = found;
          return cachedRootEl;
        };

        const marker = new AdvancedMarkerElement({
          map,
          position,
          title: input.label || input.address,
          content: containerEl,
          collisionBehavior: CB.REQUIRED,
        });

        // 点击 → 弹出卡片
        marker.addListener('click', () => {
          showPopupFor(input.id);
        });

        const setHover = (on: boolean) => {
          setDataAttrWithRetry(getRootEl, 'data-hovered', on ? 'true' : 'false');
          marker.zIndex = on
            ? Z.HOVERED
            : currentSelectedIdRef.current === input.id
            ? Z.SELECTED
            : Z.BASE;
        };
        const setSelect = (on: boolean) => {
          setDataAttrWithRetry(getRootEl, 'data-selected', on ? 'true' : 'false');
          marker.zIndex = on
            ? Z.SELECTED
            : currentHoveredIdRef.current === input.id
            ? Z.HOVERED
            : Z.BASE;
        };

        markerIndexRef.current.set(input.id, {
          marker,
          position,
          containerEl,
          getRootEl,
          hover: () => setHover(true),
          resetHover: () => setHover(false),
          select: () => setSelect(true),
          resetSelect: () => setSelect(false),
          cleanup: () => {
            if (cleanedIds.has(input.id)) return;
            cleanedIds.add(input.id);
            try {
              marker.map = null;
            } catch (e) {
              void e;
            }
            try {
              (marker as any).content = null;
            } catch (e) {
              void e;
            }
            safeUnmountRoot(markerRoot);
            setTimeout(() => {
              try {
                containerEl.remove();
              } catch (e) {
                void e;
              }
            }, 0);
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

      // 初始化完成后，同步一次外部状态（不触发重建）
      if (cancelled) return;
      const initSel = initialSelectedIdRef.current;
      const initHov = initialHoveredIdRef.current;
      if (initSel && markerIndexRef.current.has(initSel)) {
        selectHighLight(initSel, true);
        showPopupFor(initSel);
      } else if (initHov && markerIndexRef.current.has(initHov)) {
        hoverHighLight(initHov, false);
      }
    }

    init();

    // 清理
    return () => {
      cancelled = true;

      if (overlayRootRef.current) safeUnmountRoot(overlayRootRef.current);
      overlayRootRef.current = null;

      if (overlayRef.current) {
        overlayRef.current.attachToMap(null);
        overlayRef.current = null;
      }

      for (const l of mapListenersRef.current) {
        try {
          l.remove();
        } catch (e) {
          void e;
        }
      }
      mapListenersRef.current = [];

      const snapshot = Array.from(mapForCleanup.values());
      snapshot.forEach(item => {
        try {
          item.marker.map = null;
        } catch (e) {
          void e;
        }
        try {
          item.cleanup();
        } catch (e) {
          void e;
        }
      });
      mapForCleanup.clear();
      currentHoveredIdRef.current = null;
      currentSelectedIdRef.current = null;
    };
  }, [
    googleMapApiKey,
    mergedOptions,
    addresses,
    zoom,
    ensureOverlayCtor,
    ensureOverlayInstance,
    showPopupFor,
    clearHoverOnly,
    clearSelectOnly,
    closeOverlay,
    hoverHighLight,
    selectHighLight,
  ]);

  // ---------- 外部驱动 Hover：先恢复旧的，再把新的设为 true ----------
  useEffect(() => {
    const prevId = currentHoveredIdRef.current;
    if (prevId && prevId !== hoveredAddressId) {
      const prevItem = markerIndexRef.current.get(prevId);
      if (prevItem) prevItem.resetHover(); // => data-hovered="false"
    }

    if (hoveredAddressId) {
      const item = markerIndexRef.current.get(hoveredAddressId);
      if (item) item.hover(); // => data-hovered="true"
      currentHoveredIdRef.current = hoveredAddressId;
    } else {
      currentHoveredIdRef.current = null;
    }
  }, [hoveredAddressId]);

  // ---------- 外部驱动 Select：只改 data-selected，并弹窗 ----------
  useEffect(() => {
    if (!selectedAddressId) {
      const prevId = currentSelectedIdRef.current;
      if (prevId) {
        const prevItem = markerIndexRef.current.get(prevId);
        if (prevItem) prevItem.resetSelect(); // => data-selected="false"
      }
      currentSelectedIdRef.current = null;
      lastSelectionRef.current = { id: null, tick: -1 };
      closeOverlay();
      return;
    }

    const last = lastSelectionRef.current;
    if (last.id === selectedAddressId && last.tick === selectedTick) return;
    lastSelectionRef.current = { id: selectedAddressId, tick: selectedTick };

    // 选中前清除与其不同的 hover
    const hoveredId = currentHoveredIdRef.current;
    if (hoveredId && hoveredId !== selectedAddressId) {
      const prevHover = markerIndexRef.current.get(hoveredId);
      if (prevHover) prevHover.resetHover();
      currentHoveredIdRef.current = null;
    }

    // 取消旧选中
    const prevSelId = currentSelectedIdRef.current;
    if (prevSelId && prevSelId !== selectedAddressId) {
      const prevSel = markerIndexRef.current.get(prevSelId);
      if (prevSel) prevSel.resetSelect();
    }

    const item = markerIndexRef.current.get(selectedAddressId);
    if (item) {
      item.select(); // => data-selected="true"
      currentSelectedIdRef.current = selectedAddressId;
      showPopupFor(selectedAddressId);
    }
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
