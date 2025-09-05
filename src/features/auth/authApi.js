import api from "../../services/api.js";

export const registerUser = async(userData)=>{
    const response = await api.post('/auth/register',userData);
    return response.data;
}

// POST /login
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const currentUser = async()=>{
  const response = await api.get('/users/me');
  console.log(response);
  return response.data;
}