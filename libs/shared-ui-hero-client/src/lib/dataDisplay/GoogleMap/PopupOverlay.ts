export type PopupOffset = { x: number; y: number };

export interface IPopupOverlay extends google.maps.OverlayView {
  setContent(el: HTMLElement): void;
  getInnerContainer(): HTMLDivElement;
  setPosition(pos: google.maps.LatLng | google.maps.LatLngLiteral): void;
  setOffset(offset: PopupOffset): void;
  setVisible(show: boolean): void;
  attachToMap(map: google.maps.Map | null): void;
}

export type PopupOverlayCtor = new () => IPopupOverlay;

export function createPopupOverlayClass(): PopupOverlayCtor {
  if (typeof google === 'undefined' || !google.maps?.OverlayView) {
    throw new Error('Google Maps SDK not loaded yet.');
  }

  const Impl = class extends google.maps.OverlayView implements IPopupOverlay {
    // 这些可以保持 private，不会泄露到导出的类型里
    private container: HTMLDivElement;
    private inner: HTMLDivElement;
    private position: google.maps.LatLng | google.maps.LatLngLiteral | null = null;
    private offset: PopupOffset = { x: 0, y: 0 };
    private isVisible = false;

    constructor() {
      super();
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.transform = 'translate(-50%, -100%)';
      this.container.style.display = 'none';
      this.container.style.zIndex = '1000';
      this.inner = document.createElement('div');
      this.container.appendChild(this.inner);
    }

    override onAdd() {
      this.getPanes()?.floatPane.appendChild(this.container);
    }
    override onRemove() {
      this.container.remove();
    }
    override draw() {
      if (!this.position) return;
      const proj = this.getProjection();
      if (!proj) return;
      const pt = proj.fromLatLngToDivPixel(
        this.position instanceof google.maps.LatLng
          ? this.position
          : new google.maps.LatLng(this.position.lat, this.position.lng)
      );
      if (!pt) return;
      this.container.style.left = `${pt.x + this.offset.x}px`;
      this.container.style.top = `${pt.y + this.offset.y}px`;
    }

    setContent(el: HTMLElement) {
      this.inner.innerHTML = '';
      this.inner.appendChild(el);
    }
    getInnerContainer(): HTMLDivElement {
      return this.inner;
    }
    setPosition(pos: google.maps.LatLng | google.maps.LatLngLiteral) {
      this.position = pos;
      this.draw();
    }
    setOffset(offset: PopupOffset) {
      this.offset = offset;
      this.draw();
    }
    setVisible(show: boolean): void {
      // 给动画加个状态标记（可选）
      this.container.setAttribute('data-open', show ? 'true' : 'false');

      if (show) {
        // ✅ 首次打开一定要把容器显示出来
        this.container.style.display = 'block';
        this.container.style.pointerEvents = 'auto';
      } else {
        // 关闭时不要立刻隐藏，留给 Framer Motion 播放 exit 动画
        this.container.style.pointerEvents = 'none';
        // 不设置 display = 'none'
      }
    }

    attachToMap(map: google.maps.Map | null) {
      this.setMap(map);
    }
  };

  // 关键：把返回值断言为“构造器类型”，而不是把匿名类类型直接暴露出去
  return Impl as unknown as PopupOverlayCtor;
}
