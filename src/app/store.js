import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import friendsReducer from '../features/friends/friendsSlice.js';
import groupReducer from '../features/group/groupSlice.js';
import expenseReducer from '../features/expenses/expenseSlice.js';
import usersReducer from '../features/users/usersSlice.js';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        friends: friendsReducer,
        groups: groupReducer,
        expenses: expenseReducer,
        users: usersReducer
    },
});