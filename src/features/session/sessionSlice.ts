import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SessionState {
  isRefreshing: boolean
  expiryTimestamp: number | null
}

const initialState: SessionState = {
  isRefreshing: false,
  expiryTimestamp: null,
}

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startRefreshing: (state) => {
      state.isRefreshing = true
    },
    stopRefreshing: (state) => {
      state.isRefreshing = false
    },
    setExpiry: (state, action: PayloadAction<number>) => {
      state.expiryTimestamp = action.payload
    },
    clearSessionState: (state) => {
      state.isRefreshing = false
      state.expiryTimestamp = null
    },
  },
})

export const {
  startRefreshing,
  stopRefreshing,
  setExpiry,
  clearSessionState,
} = sessionSlice.actions

export default sessionSlice.reducer