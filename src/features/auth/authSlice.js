import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser,loginUser,currentUser } from "./authApi.js";


const initialState = {
    token: localStorage.getItem('token'),
    user: null,
    status: 'idle',
    error: null,
};

export const login = createAsyncThunk('auth/login',async (credentials,thunkAPI)=>{
    try{
        const res = await loginUser(credentials);
        return res;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

export const register = createAsyncThunk('/auth/register',async(credentials,thunkAPI)=>{
    try {
        const res = await registerUser(credentials);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
    try {
        const res = await currentUser();
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state)=>{
            state.user=null;
            state.token=null;
            localStorage.removeItem('token');
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(register.fulfilled,(state,action)=>{
            state.status = 'succeeded';
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token',action.payload.token);
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.status = 'succeeded';
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token',action.payload.token);
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
            
            state.status = 'succeeded';
        })
        .addMatcher((action)=>action.type.startsWith('/auth') && action.type.endsWith('/pending'),(state)=>{
            state.status = 'loading';
            state.error = null;
        })
        .addMatcher((action)=>action.type.startsWith('/auth') && action.type.endsWith('/rejected'),(state,action)=>{
            state.status='failed';
            state.error = action.payload?.msg || 'Something went wrong';
        })
    }
})

export const {logout} = authSlice.actions;

export default authSlice.reducer;