import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  globalLoading: boolean;
  modalOpen: boolean;
  toastMessage: string | null;
}

const initialState: UIState = {
  globalLoading: false,
  modalOpen: false,
  toastMessage: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },

    setToastMessage: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  setModalOpen,
  setToastMessage,
} = uiSlice.actions;

export default uiSlice.reducer;