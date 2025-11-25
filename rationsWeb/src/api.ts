import axios from 'axios'

const baseURL = (import.meta.env.VITE_PLATFORM_API_URL as string) || '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    const h: any = config.headers
    if (h && typeof h.set === 'function') {
      h.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` } as any
    }
  }
  return config
})

export default api