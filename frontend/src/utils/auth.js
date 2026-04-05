// Token存取
const TOKEN_KEY = 'logic_token'

export const auth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },
  
  isTokenValid() {
    const token = this.getToken()
    if (!token) return false
    
    try {
      const data = JSON.parse(atob(token))
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      return Date.now() - data.timestamp < sevenDays
    } catch {
      return false
    }
  }
}
