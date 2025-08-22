import { Root } from 'react-dom/client';
import { safeUnmountRoot } from './deferUnmount';

export function cleanupMarkerNode(
  marker: google.maps.marker.AdvancedMarkerElement,
  markerRoot: Root | null,
  hostEl: HTMLElement | null
) {
  try {
    // 1) Stop Google from holding on to the node.
    //    (Either remove the whole marker from the map, or clear content)
    marker.map = null; // This detaches from map
    marker.content = null as any; // And release the adopted node
  } catch {
    return;
  }

  try {
    // 2) If the element is still in DOM somewhere, detach it so React won't fight the new parent.
    if (hostEl && hostEl.isConnected && hostEl.parentNode) {
      hostEl.parentNode.removeChild(hostEl);
    }
  } catch {
    return;
  }

  // 3)  Defer unmount to avoid nested unmounts
  safeUnmountRoot(markerRoot);
}
