import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchGroups = createAsyncThunk('/group/fetchGroups',async(__dirname,thunkAPI)=>{
    try{
        const res = await api.get('/groups');
        return res.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const createGroup = createAsyncThunk('/group/create', async(groupData,thunkAPI)=>{
    try {
        const res = await api.post('/groups/create',groupData);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const addGroupMember = createAsyncThunk('group/addGroupMember', async ({ groupId, userEmail }, thunkAPI) => {
  try {
    const res = await api.put(`groups/${groupId}/add-member`, {email:userEmail });
    return res.data.updatedGroup ;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.msg);
  }
});

export const removeGroupMember = createAsyncThunk('group/removeGroupMember', async ({ groupId, userEmail }, thunkAPI) => {
  try {
    const res = await api.put(`groups/${groupId}/remove-member`, { groupId, email:userEmail });
    return res.data.updatedGroup;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to remove member');
  }
});

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearGroupMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGroups
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createGroup
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
        state.message = 'Group created successfully';
      })
      .addCase(createGroup.rejected, (state, action) => {
         state.loading = false;
        state.error = action.payload;
      })

      // addGroupMember
      .addCase(addGroupMember.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGroup = action.payload;
        state.groups = state.groups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        );
        state.message = 'Member added successfully';
      })
      .addCase(addGroupMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeGroupMember
      .addCase(removeGroupMember.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.loading = false;
        state.groups = state.groups.map((group) =>
            group._id.toString() === updatedGroup._id.toString() ? updatedGroup : group
        );
        state.message = 'Member removed successfully';
      })
      .addCase(removeGroupMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher((action)=>action.type.startsWith('/group') && action.type.endsWith('pending'),(state)=>{
        state.loading=true;
      })
  },
});

export const {clearGroupMessage} = groupSlice.actions;
export default groupSlice.reducer;