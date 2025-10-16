export const MSW_CONFIG = {
  // Enable mocks if VITE_USE_MSW === 'true'. Defaults to true in dev, false in prod.
  enabled:
    (typeof import.meta.env.VITE_USE_MSW !== 'undefined'
      ? String(import.meta.env.VITE_USE_MSW) === 'true'
      : import.meta.env.DEV),
  onUnhandledRequest: 'bypass' as const,
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
}

