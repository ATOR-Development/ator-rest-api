import AirTorProtocolRestApi from './app'

(async () => {
  const api = new AirTorProtocolRestApi()

  await api.start()

  process.on('SIGINT', () => { api.stop() })
  process.on('SIGTERM', () => { api.stop() })
})()
