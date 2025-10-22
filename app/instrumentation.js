export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../instrumentation.js')
  }

  // Client-side instrumentation can be added here
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
  }
}