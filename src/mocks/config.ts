export const MSW_CONFIG = {
  enabled: import.meta.env.DEV || import.meta.env.PROD, // Enable in both dev and prod
  onUnhandledRequest: 'bypass' as const,
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
}

