import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Articles API
export const getArticles = () => api.get('/articles')
export const getArticleById = (id) => api.get(`/articles/${id}`)

// Profile API
export const getVillageInfo = () => api.get('/profile')
export const getOfficials = () => api.get('/profile/officials')
export const getInstitutions = () => api.get('/profile/institutions')

// Services API
export const getServices = () => api.get('/services')
export const getServiceById = (id) => api.get(`/services/${id}`)

// Stats API
export const getStatistics = () => api.get('/stats/statistics')
export const getBudget = () => api.get('/stats/budget')
export const getGalleries = () => api.get('/stats/galleries')

// Letter Request API
export const submitLetterRequest = (data) => api.post('/services', data)

export default api