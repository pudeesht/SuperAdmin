
import axios from 'axios';
// import { setApiToken} from './apiToken';
// import { useAuth } from '../context/useAuth';

const API_URL = 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});
let inMemoryToken=null;

const getApiToken= ()=> inMemoryToken;

export const setApiToken = (token)=>{
  inMemoryToken=token;
}



apiClient.interceptors.request.use( (config)=>{
  // const {token}=useAuth();
  // const token=getApiToken();
  const token=getApiToken();
  console.log("yeh mila ", token);
  if(token)
  {
    config.headers.Authorization=`Bearer ${token}`;
  }
  return config;
}, (error)=>{
  return Promise.reject(error);
} )




/**
 * A function to handle user login.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} The JWT token.
 */

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    const tokenn= response.data.token
    setApiToken(tokenn);
    // inMemoryToken=tokenn;
    return tokenn;
  } catch (error) {
    
    throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
  }
};


export const getUsers = async ( )=>{
  try{
    const response=await apiClient.get('/superadmin/users');
    return response.data;
  }
  catch(error){
    throw new Error(error.response?.data?.message||"Failed to fetch users");
  }
};








