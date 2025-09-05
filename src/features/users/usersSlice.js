import { act } from "react";
import api from "../../services/api.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const searchUsers = createAsyncThunk('users/searchUsers', async({query,context},thunkAPI)=>{
    try {
        const res = await api.get(`/users/searchUsers?query=${query}&context=${context}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error in searching users');
    }
});

const usersSlice = createSlice({
    name :'users',
    initialState: {
        results:[],
        loading: false,
        error: null
    },
    reducers: {
        clearSearchResults :(state)=>{
            state.results=[];
            state.error=null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(searchUsers.pending,(state,action)=>{
            state.loading=true;
            state.error = null;
        })
        .addCase(searchUsers.fulfilled, (state,action)=>{
            state.loading=false;
            state.results=action.payload;
        })
        .addCase(searchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export const {clearSearchResults} = usersSlice.actions;
export default usersSlice.reducer;