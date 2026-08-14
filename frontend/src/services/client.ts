// src/services/client.ts
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api",
    timeout: 15000, // حداکثر زمان انتظار برای جواب سرور
    headers: {
        "Content-Type": "application/json",
    },
});

// اینترسپتور درخواست: چسباندن توکن به تمام ریکوئست‌ها
// اضافه کردن توکن به هدرِ تمام درخواست‌ها به صورت داینامیک
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes("/auth/");
        if (error.response?.status === 401 && !isAuthEndpoint) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/auth?mode=login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;