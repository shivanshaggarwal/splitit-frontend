import React, {useEffect} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import FriendsPage from './pages/FriendsPage';
import AppNavbar from './components/Navbar.jsx';
import { useSelector,useDispatch } from 'react-redux';
import GroupsPage from './pages/GroupsPage.jsx';
import ExpensesPage from './pages/expensePage.jsx';
import { fetchCurrentUser } from './features/auth/authSlice.js';
import './App.css';


function App() {

  const dispatch = useDispatch();
  const {token,user,status} =  useSelector((state)=>state.auth);
  useEffect(()=>{
    if(token){
      console.log(20);
     dispatch(fetchCurrentUser());
    }
  }, [token,dispatch]);

  
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path='/' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/friends' element={<FriendsPage/>}/>
        <Route path='/groups' element={<GroupsPage/>}/>
        <Route path='/expenses' element={<ExpensesPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
