import api from '../../services/api.js'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';


// Add a new expense

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData, thunkAPI) => {
        
    const state = thunkAPI.getState();
    const user = state.auth.user;
    console.log(expenseData);
    const dispatch= thunkAPI.dispatch;
    console.log(expenseData);
    try {
        if(!expenseData.groupId && expenseData.splitBetween.length>0){
           expenseData.splitBetween=[...expenseData.splitBetween,user._id]
        }
      const res = await api.post("/expenses/add", expenseData);
      dispatch(fetchAllExpenses());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error adding expense");
    }
  }
);

// Get expenses for a friend
export const getFriendExpenses = createAsyncThunk(
  "expenses/getFriendExpenses",
  async (friendId, thunkAPI) => {
    try {
      const res = await api.get(`/expenses/friend/${friendId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching friend expenses");
    }
  }
);

// Get expenses for a group
export const getGroupExpenses = createAsyncThunk(
  "expenses/getGroupExpenses",
  async (groupId, thunkAPI) => {
    try {
      const res = await api.get(`/expenses/group/${groupId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching group expenses");
    }
  }
);

export const fetchAllExpenses = createAsyncThunk(
  "expenses/fetchAllExpenses",
  async (_,thunkAPI) => {
    try {
      const res = await api.get(`/expenses/fetchAllExpenses`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching group expenses");
    }
  }
);
const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
    message: null,
    groupExpenses:[],
    friendExpenses: [],
    lastUpdatedType:null
  },
  reducers: {
    clearExpenses(state) {
      state.expenses = [];
    },
    setLastUpdatedType(state,action){
        state.lastUpdatedType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload?.expense);
        state.message = "Expense added successfully";
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Friend Expenses
      .addCase(getFriendExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.friendExpenses = action.payload;
      })
      .addCase(getFriendExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Group Expenses
      .addCase(getGroupExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.groupExpenses = action.payload;
      })
      .addCase(getGroupExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      //fetchAllExpenses
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;