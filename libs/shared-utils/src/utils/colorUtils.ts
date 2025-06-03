function convertHexToRGBA(hex: string, opacity: number) {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.startsWith('#')) {
    const hexWithoutHash = hex.slice(1);
    if (hexWithoutHash.length === 3) {
      // Expand shorthand hex (#RGB -> #RRGGBB)
      r = parseInt(hexWithoutHash[0] + hexWithoutHash[0], 16);
      g = parseInt(hexWithoutHash[1] + hexWithoutHash[1], 16);
      b = parseInt(hexWithoutHash[2] + hexWithoutHash[2], 16);
    } else if (hexWithoutHash.length === 6) {
      r = parseInt(hexWithoutHash.substring(0, 2), 16);
      g = parseInt(hexWithoutHash.substring(2, 4), 16);
      b = parseInt(hexWithoutHash.substring(4, 6), 16);
    }
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

type ShiftColorProps = {
  hex: string;
  shiftLevel?: number;
};
function shiftColor({ hex, shiftLevel = 1 }: ShiftColorProps) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error('Invalid hex color format');
  }
  const getShift = (shiftLevel: number) => {
    switch (shiftLevel) {
      case 1:
        return { r: 29, g: 145, b: 29 };
      case 2:
        return { r: 51, g: 129, b: 51 };
      case 3:
        return { r: -104, g: -60, b: -104 };
      default:
        return { r: 0, g: 0, b: 0 };
    }
  };
  const shift = getShift(shiftLevel);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.max(0, Math.min(r + shift.r, 255));
  const newG = Math.max(0, Math.min(g + shift.g, 255));
  const newB = Math.max(0, Math.min(b + shift.b, 255));

  const toHex = (val: number) => val.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export { convertHexToRGBA, shiftColor };
