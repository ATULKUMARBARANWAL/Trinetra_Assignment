"use client"

import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { store } from "@/core/store"
import { refreshThunk, logout } from "@/features/auth/authSlice"

/* =====================================
   Create Axios Instance
===================================== */

const api = axios.create({
  baseURL: "/api", // mock base
  timeout: 10000,
})

/* =====================================
   Refresh Control Variables
===================================== */

let isRefreshing = false
let refreshPromise: Promise<any> | null = null

type FailedRequest = {
  resolve: (token: string) => void
  reject: (error: any) => void
}

let failedQueue: FailedRequest[] = []

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  failedQueue = []
}

/* =====================================
   Request Interceptor
===================================== */

api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.accessToken

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* =====================================
   Response Interceptor
===================================== */

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

if (
  error.response?.status === 401 &&
  !originalRequest._retry
){
      originalRequest._retry = true

      if (isRefreshing) {
        // 🔁 Queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true

      try {
        refreshPromise = store.dispatch(refreshThunk()).unwrap()
        const response = await refreshPromise

        const newToken = response.accessToken

        processQueue(null, newToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    }

    return Promise.reject(error)
  }
)

export default api