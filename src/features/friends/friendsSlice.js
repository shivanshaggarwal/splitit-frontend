import api from "../../services/api";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

const API = '/friends';

export const fetchFriends = createAsyncThunk('/friends/fetch', async(_,thunkAPI)=>{
    try{
        const res = await api.get(`${API}/list`);
        return res.data;
    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data.msg);
    }
})


export const sendFriendRequest = createAsyncThunk('friends/sendRequest',async(email,thunkAPI)=>{
    try {
        const res = await api.post(`${API}/send`,{email});
        return res.data.msg;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});


export const rejectFriendRequest = createAsyncThunk('friends/rejectRequest',async(requesterId,thunkAPI)=>{
    try {
        const res = await api.post(`${API}/reject`,{requesterId});
        return {requesterId , msg: res.data.msg};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const acceptFriendRequest = createAsyncThunk('friends/acceptRequest',async(request,thunkAPI)=>{
    try {
        const requesterId = request._id
        const res = await api.post(`${API}/accept`,{requesterId});
        return {request , msg: res.data.msg};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const fetchFriendRequests = createAsyncThunk(
  'friends/fetchRequests',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`${API}/requests`);
      
      return res.data; // list of users
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.msg);
    }
  }
);

export const unfriendRequest = createAsyncThunk('friends/unfriend',async(unfriendId,thunkAPI)=>{
    try {
      const res = await api.post(`${API}/unfriend`, {unfriendId});
      return {unfriendId, msg:res.data.msg}; // list of users
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.msg);
    }
})
const friendsSlice = createSlice({
    name:"friends",
    initialState:{
        loading: false,
        error: null,
        friends: [],
        requests: [],
        message: null
    },
    reducers:{
        clearFriendMessage(state) {
            state.message = null;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchFriends.fulfilled, (state,action)=>{
            state.loading = false;
            state.friends = action.payload;
        })
        .addCase(fetchFriends.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(sendFriendRequest.fulfilled, (state,action)=>{
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(sendFriendRequest.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(rejectFriendRequest.fulfilled, (state,action)=>{
            state.loading = false;
            state.message = action.payload.msg;
            state.requests = state.requests.filter((u)=> u._id !==  action.payload.requesterId);
        })
        .addCase(rejectFriendRequest.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(acceptFriendRequest.fulfilled, (state,action)=>{
            state.loading = false;
            state.message = action.payload.msg;
            state.requests = state.requests.filter(u => u._id !== action.payload.request._id);
            state.friends.push(action.payload.request);
        })
        .addCase(acceptFriendRequest.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchFriendRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.requests = action.payload;
        })
        .addCase(fetchFriendRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(unfriendRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.msg;
            state.friends = state.friends.filter((u)=>u._id.toString() !== action.payload.unfriendId.toString());
        })
        .addCase(unfriendRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addMatcher((action)=>action.type.startsWith('/friends') && action.type.endsWith('pending'), (state)=>{
            state.loading=true;
        })
    }
});

export const {clearFriendMessage} = friendsSlice.actions;
export default friendsSlice.reducer;