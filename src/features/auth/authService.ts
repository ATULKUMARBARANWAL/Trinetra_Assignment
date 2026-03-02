/* =====================================
   Types
===================================== */

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: { id: string; email: string }
  expiresIn: number
}

interface RefreshResponse {
  accessToken: string
  expiresIn: number
}

/* =====================================
   Mock Token Store (for simulation)
===================================== */

// 🔥 simulate refresh token expiry
let refreshTokenExpiry = 0

/* =====================================
   Mock Login API
===================================== */

export const mockLoginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simulate validation
      if (!email || !password) {
        reject(new Error("Email and password required"))
        return
      }

      // 🔥 set refresh token expiry (2 minutes demo)
      refreshTokenExpiry = Date.now() + 15 * 60 * 1000

     

      resolve({
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        user: { id: "1", email },
        expiresIn: 60, // access token expires in 60s
      })
    }, 1000)
  })
}

/* =====================================
   Mock Refresh Token API
===================================== */

export const mockRefreshApi = async (
  refreshToken: string | null
): Promise<RefreshResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     
      // ❌ invalid or expired refresh token
      if (!refreshToken) {
      
        reject(new Error("Invalid refresh token"))
        return
      }

      if (Date.now() > refreshTokenExpiry) {

        reject(new Error("Refresh token expired"))
        return
      }

      // ✅ success
      const newAccessToken = "mock_access_token_" + Date.now()


      resolve({
        accessToken: newAccessToken,
        expiresIn: 60, // new access token expiry
      })
    }, 800)
  })
}