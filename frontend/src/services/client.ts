// src/services/client.ts
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 15000, // حداکثر زمان انتظار برای جواب سرور
    headers: {
        "Content-Type": "application/json",
    },
});

// اینترسپتور درخواست: چسباندن توکن به تمام ریکوئست‌ها
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// اینترسپتور پاسخ: مدیریت خطاهای سراسری (مثل منقضی شدن توکن)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // توکن نامعتبر است -> خروج کاربر
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/auth?mode=login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;