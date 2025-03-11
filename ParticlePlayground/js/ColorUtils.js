// Color manipulation utilities

export function getRandomColor() {
  const hue = Math.random() * 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export function blendColors(color1, color2, ratio) {
  // Ensure color1 and color2 are valid colors
  color1 = color1 || getRandomColor();
  color2 = color2 || getRandomColor();

  // If color is in HSL format, convert to RGB first
  if (color1.startsWith('hsl')) {
    color1 = hslToRgb(color1);
  }
  if (color2.startsWith('hsl')) {
    color2 = hslToRgb(color2);
  }

  // Ensure hex colors start with #
  color1 = color1.startsWith('#') ? color1 : `#${color1}`;
  color2 = color2.startsWith('#') ? color2 : `#${color2}`;

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) {
    return getRandomColor(); // Fallback if conversion fails
  }

  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslToRgb(hsl) {
  // Parse HSL string
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return getRandomColor();

  const h = parseInt(match[1]);
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle 3-digit and 6-digit hex codes
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Ensure hex is 6 characters long
  if (hex.length !== 6) {
    console.warn(`Invalid hex color: ${hex}`);
    return getRandomRgb();
  }

  try {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  } catch (error) {
    console.warn(`Error converting hex to RGB: ${hex}`, error);
    return getRandomRgb();
  }
}

function getRandomRgb() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}