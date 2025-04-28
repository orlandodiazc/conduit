import { axiosInstance } from '@kubb/plugin-client/clients/axios.ts'
import { getStoredToken, setStoredToken } from '@/auth'

axiosInstance.interceptors.request.use((request) => {
  const token = getStoredToken()
  if (token) {
    request.headers['Authorization'] = 'Bearer ' + token
  }
  return request
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const statusCode = error.response.status
      if (statusCode === 401) {
        setStoredToken(null)
        window.location.reload()
      }
    }
    return Promise.reject(error)
  },
)
