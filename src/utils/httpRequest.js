import axios from "axios";
import Cookie from "js-cookie";

const httpRequest = axios.create({
    baseURL: "http://localhost:5555",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging and auth
httpRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt") || Cookie.get('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // console.log('Request:', {
        //     url: config.url,
        //     method: config.method,
        //     headers: config.headers,
        //     data: config.data
        // });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
httpRequest.interceptors.response.use(
    (response) => {
        // console.log('Response:', {
        //     status: response.status,
        //     data: response.data
        // });
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            config: error.config
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Handle unauthorized error
            localStorage.removeItem('jwt');
            Cookie.remove('jwt');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// httpRequest.interceptors.request.use((config) => {
//     const token = localStorage.getItem("jwt");
//     if (token) {
//         config.headers.Authorization = Bearer ${token};
//     }
//     return config;
// });

export default httpRequest;