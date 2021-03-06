import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//action

export const fetchWeatherAction = createAsyncThunk(
    //action type
    'weather/fetch',
    async(payload, {rejectWithValue, getState, dispatch}) => {
try {
    //fetch data
    const {data} = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${payload}&appid=${process.env.REACT_APP_WEATHER_SERVICE_KEY}`
    );
    return data
} catch (error) {
    if(!error?.response){
        throw error
    }
    return rejectWithValue(error?.response?.data)
}
    }
);
//slices

const weatherSlice = createSlice({
    name: "weather",
    initialState: {},
    extraReducers: (builder) => {
        //pending
        builder.addCase(fetchWeatherAction.pending, (state, action) => {
            state.loading = true;
        });
        //fulfilled
        builder.addCase(fetchWeatherAction.fulfilled, (state, action) => {
            state.weather = action?.payload;
            state.loading = false;
            state.error = undefined;
        });
        //rejected
        builder.addCase(fetchWeatherAction.rejected, (state, action) => {
            state.loading = false;
            state.weather = undefined;
            state.error = action?.payload;
        });
    },
});

export default weatherSlice.reducer;