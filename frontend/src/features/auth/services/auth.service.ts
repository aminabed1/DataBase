// src/features/auth/services/auth.service.ts
import apiClient from "@/services/client";

export const authService = {
    register: async (payload: any) => {
        const response = await apiClient.post("/auth/register", payload);
        return response.data;
    },

    loginWithPassword: async (identifier: string, pass: string) => {
        const response = await apiClient.post("/auth/login", { identifier, password: pass });
        return response.data;
    },

    requestOtp: async (identifier: string) => {
        const response = await apiClient.post("/auth/otp/request", { identifier });
        return response.data;
    },

    verifyOtp: async (identifier: string, otp: string) => {
        const response = await apiClient.post("/auth/otp/verify", { identifier, otp });
        return response.data;
    }
};