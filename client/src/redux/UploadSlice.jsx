import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadFiles: (state, action) => {
      state.files = action.payload;
    },
    clearUploadFiles: (state) => {
      state.files = []
    }
  }
})

export const { setUploadFiles, clearUploadFiles } = uploadSlice.actions;
export default uploadSlice.reducer;