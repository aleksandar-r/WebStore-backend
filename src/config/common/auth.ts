const auth = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  cookieMaxAge: 1000 * 60 * 60 * 24 * 7, // ms * s * m * h * d
  role: {
    editor: 'Editor',
    admin: 'Admin',
    user: 'User',
  },
}

export default auth
