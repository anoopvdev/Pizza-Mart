import axios from "axios";

const adminApi = axios.create({
    baseURL: "https://pizza-mart-mu8r.onrender.com/api/admin/auth/",
});

adminApi.interceptors.request.use((config) => {

    const token = localStorage.getItem("adminAccess");

    console.log("Token:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request headers:", config.headers);

    return config;
});

export default adminApi;