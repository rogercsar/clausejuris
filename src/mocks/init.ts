import { worker } from './browser'

export async function initMocks() {
  // Enable MSW in both development and production for demo purposes
  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      waitUntilReady: true,
    })
    console.log('MSW started successfully')
  } catch (error) {
    console.warn('MSW failed to start:', error)
    // Continue even if MSW fails
  }
}

