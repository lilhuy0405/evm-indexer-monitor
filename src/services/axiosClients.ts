import axios from 'axios';
import queryString from 'query-string';



const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  }
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
//   const accessToken = getLocalStorageObject(PROFILE_STORAGE_KEY);
//   if (accessToken) {
//     const token = accessToken.accessToken;
//     // @ts-ignore
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  return config;
})
axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  }
  return response;
}, (error) => {
  let errorMessage = "Something went wrong";
  if (error.response.data && error.response.data.error.length > 0) {
    if (typeof error.response.data.error === 'string') {
      errorMessage = error.response.data.error;
    } else {
      errorMessage = error.response.data.error[0]
    }
    throw {...error.response.data, message: errorMessage};
  } else {
    throw {...error, message: errorMessage};
  }
// Handle errors

});
export default axiosClient;
