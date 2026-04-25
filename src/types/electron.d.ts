interface Window {
  electronAPI?: {
    getApiBase: () => Promise<string>
    getOllamaStatus: () => Promise<{ ready: boolean; status: string; baseUrl: string; gpu: 'unknown' }>
  }
}
