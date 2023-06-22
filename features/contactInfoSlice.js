import { createSlice } from "@reduxjs/toolkit";

const contactInfoSlice = createSlice({
  name: 'contactInfo',
  initialState: {
    phoneNumber: '',
    address: '',
    doorCode: '',
  },
  reducers: {
    contactInfoChanged: (state, action) => {
      if (typeof action.payload.phoneNumber === 'string') state.phoneNumber = action.payload.phoneNumber;
      if (typeof action.payload.address === 'string') state.address = action.payload.address;
      if (typeof action.payload.doorCode === 'string') state.doorCode = action.payload.doorCode;
    },
  },
});

export const { contactInfoChanged } = contactInfoSlice.actions;
export default contactInfoSlice;