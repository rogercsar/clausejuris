import { worker } from './browser'
import { MSW_CONFIG } from './config'

export async function initMocks() {
  // Enable MSW only when configured via MSW_CONFIG.enabled
  if (!MSW_CONFIG.enabled) {
    console.log('MSW disabled by configuration')
    return
  }

  try {
    await worker.start({
      onUnhandledRequest: MSW_CONFIG.onUnhandledRequest,
      serviceWorker: MSW_CONFIG.serviceWorker,
      waitUntilReady: true,
    })
    console.log('MSW started successfully')
  } catch (error) {
    console.warn('MSW failed to start:', error)
    // Continue even if MSW fails
  }
}

