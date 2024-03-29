export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (window.umami) {
    window.umami.track(event, data);
  }
}

export function getRandomServerUrl(): string {
  const serverUrls = [];

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('SERVER_URL') && value) {
      serverUrls.push(value);
    }
  }

  return serverUrls[Math.floor(Math.random() * serverUrls.length)];
}

export function arrayLt(array1: Array<any>, array2: Array<any>) {
  const length = Math.min(array1.length, array2.length);

  for (let i = 0; i < length; i++) {
    if (array1[i] < array2[i]) {
      return true;
    } else if (array1[i] > array2[i]) {
      return false;
    }
  }

  return array1.length < array2.length;
}

export function arrayGt(array1: Array<any>, array2: Array<any>) {
  const length = Math.min(array1.length, array2.length);

  for (let i = 0; i < length; i++) {
    if (array1[i] > array2[i]) {
      return true;
    } else if (array1[i] < array2[i]) {
      return false;
    }
  }

  return array1.length > array2.length;
}
