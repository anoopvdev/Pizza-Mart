import axios from "axios";

const api = axios.create({
    baseURL: "/api/user/auth/",
});

export default api;