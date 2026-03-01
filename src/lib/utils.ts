// =====================================
// Auth Utils
// =====================================

// check if token expired
export const isTokenExpired = (expiry: number | null) => {
  if (!expiry) return true
  return Date.now() > expiry
}

// get remaining time
export const getRemainingTime = (expiry: number) => {
  return expiry - Date.now()
}

// delay helper
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// =====================================
// Validation Utils
// =====================================

// email validation
export const isValidEmail = (email: string) => {
 return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)
}

// password validation
export const isValidPassword = (password: string) => {
  return password.length >= 6
}