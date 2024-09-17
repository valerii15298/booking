export function invokeOnDoubleCall<T extends (...args: unknown[]) => unknown>(
  func: T,
  threshold = 300,
): (...args: Parameters<T>) => void {
  let lastCallTime: number | null = null;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (lastCallTime && currentTime - lastCallTime <= threshold) {
      lastCallTime = null;
      func(...args);
    }

    lastCallTime = currentTime;
  };
}
