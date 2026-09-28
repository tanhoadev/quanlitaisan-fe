import axiosClient from '../api/axiosClient'

const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', {
    email,
    password,
  })

  const data = response.data

  localStorage.setItem('token', data.token)

  localStorage.setItem(
    'user',
    JSON.stringify({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      roles: data.roles ?? [],
      expiresAt: data.expiresAt,
    })
  )

  return data
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const getToken = () => {
  return localStorage.getItem('token')
}

const getUser = () => {
  const user = localStorage.getItem('user')

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

const isAuthenticated = () => {
  const token = getToken()
  const user = getUser()

  if (!token || !user) {
    return false
  }

  if (user.expiresAt) {
    const expiresAt = new Date(user.expiresAt)

    if (expiresAt <= new Date()) {
      logout()
      return false
    }
  }

  return true
}

const hasRole = (role) => {
    const user = getUser()

    if (!user || !Array.isArray(user.roles)) {
        return false
    }

    return user.roles.includes(role)
}

const hasAnyRole = (roles = []) => {
    const user = getUser()

    if (!user || !Array.isArray(user.roles)) {
        return false
    }

    return roles.some((role) =>
        user.roles.includes(role)
    )
}

const authService = {
  login,
  logout,
  getToken,
  getUser,
  isAuthenticated,
  hasRole,
  hasAnyRole,
}

export default authService