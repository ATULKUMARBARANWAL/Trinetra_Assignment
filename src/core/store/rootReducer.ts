import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "@/features/auth/authSlice"
import chatReducer from "@/features/chat/chatSlice"
import documentReducer from "@/features/document/documentSlice"
import sessionReducer from "@/features/session/sessionSlice"
 import uiReducer from "@/features/ui/uiSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  session: sessionReducer,
  chat: chatReducer,
   document: documentReducer,
  ui: uiReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer