// Utility functions for the particle system

export function calculateDistance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function getRandomNumber(min, max) {
  return min + Math.random() * (max - min);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

