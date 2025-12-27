import axios from "axios";
export const API_URL = "http://localhost:8085/api"

export const getErrorMessage =(error)=>{

    return error?.response?.data?.error ? error?.response?.data?.error : "Something went Wrong";
}


const apiClient = axios.create({
    baseURL:API_URL
})

apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;  
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const axiosInstance = apiClient 