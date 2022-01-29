import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

type UserState = {
  queryArg: string;
  selectedUserArg: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  activeCoord: {lat: number; lng: number};
};

const latitude = 41.878113;
const longitude = -87.629799;

const initialState: UserState = {
  queryArg: '',
  selectedUserArg: '',
  status: 'idle',
  error: undefined,
  activeCoord: {
    lat: 0,
    lng: 0,
  },
};

export const fetchGeo = createAsyncThunk(
  'user/fetchGeoLocation',
  async (payload, thunkAPI) => {
    let varianceVar = Math.random();
    let newLat = latitude - varianceVar;
    let newLng = longitude - varianceVar;

    return await fetch(
      `https://services.gisgraphy.com/reversegeocoding/search?format=json&lat=${newLat}&lng=${newLng}`,
    ).then(response => response.json());
  },
);

export const userSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setQueryArg: (state, action: PayloadAction<string>) => {
      state.queryArg = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUserArg = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGeo.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchGeo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeCoord = action.payload.result[0];
      })
      .addCase(fetchGeo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {setQueryArg, setSelectedUser} = userSlice.actions;

export default userSlice.reducer;
