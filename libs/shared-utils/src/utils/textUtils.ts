/**
 * Truncates a given string to a specified length and appends '...' if necessary.
 * If `text` is null or undefined, returns `null`.
 */
const truncateString = (text?: string | null, num = 50): string | null => {
  if (typeof text === 'string') {
    if (text.length <= num) {
      return text;
    }
    return text.slice(0, num) + '...';
  }
  return null;
};

/**
 * hello => Hello;
 * WORLD => World
 */
function capitalize(str: string): string {
  if (!str) return '';

  return str
    .split(' ')
    .map(word => {
      if (!word) return ''; // 防止连续空格导致空字符串报错
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Formats a string or number by keeping only numeric characters and adjusting its length:
 * - Truncates if it exceeds the specified length.
 * - Pads with '0' at the beginning if it's shorter than the specified length.
 *
 * @param input  The input string or number.
 * @param length  The desired length of the output.
 * @returns  The formatted numeric string. e.g. 1 => "01"
 */
function formatNumberString(input: string | number, length: number): string {
  // 1、转换input为string
  let numericString = String(input).replace(/\D/g, '');

  // 2、remove leading 0
  numericString = numericString.replace(/^0+/, '');

  // 3、截取长度，防止超出
  numericString = numericString.slice(0, length);

  // 4、不够长度的部分用'0'补足
  return numericString.padStart(length, '0');
}

function trim(v: unknown) {
  return typeof v === 'string' ? v.trim() : v;
}

export { truncateString, capitalize, formatNumberString, trim };
