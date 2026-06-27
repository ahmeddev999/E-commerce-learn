import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api", // dallai agar lo development bu yakam dana agar wanabu production bet ba
    withCredentials: true, // regaman pe dadat cookie bneren la requestakan lagal har requestakan cookieka daner dreat by default
});

export default axiosInstance;