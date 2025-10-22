class Metrics {
  constructor() {
    this.metrics = {
      codeGenerations: 0,
      databaseSaves: 0,
      errors: 0,
      apiCalls: 0
    }
    this.startTime = Date.now()
  }

  increment(metric) {
    if (this.metrics[metric] !== undefined) {
      this.metrics[metric]++
    }
  }

  getMetrics() {
    const uptime = Date.now() - this.startTime
    return {
      ...this.metrics,
      uptime: `${Math.floor(uptime / 1000)}s`,
      averageGenerationsPerMinute: (this.metrics.codeGenerations / (uptime / 60000)).toFixed(2)
    }
  }

  logMetrics() {
    console.log('📊 Application Metrics:', this.getMetrics())
  }
}

// Singleton instance
export const metrics = new Metrics()