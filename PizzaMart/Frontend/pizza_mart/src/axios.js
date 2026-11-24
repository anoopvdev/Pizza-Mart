import axios from "axios";

const api = axios.create({
    baseURL: "https://herself-optimize-extraction-grace.trycloudflare.com/api/user/auth/",
   
});

export default api;