// src/features/auth/services/auth.service.ts
import apiClient from "@/services/client";

export const authService = {
    register: async (payload: any) => {
        const requestBody = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phone,
            email: payload.email,
            password: payload.password,
            confirmPassword: payload.confirmPassword,
            role: "BUYER",
            cityId: Number(payload.city_id),
        };

        const response = await apiClient.post("/auth/register", requestBody);
        return response.data;
    },

    loginWithPassword: async (identifier: string, pass: string) => {
        const response = await apiClient.post("/auth/login", {
            credential: identifier,
            password: pass
        });
        return response.data;
    },

    requestOtp: async (identifier: string) => {
        const response = await apiClient.post("/auth/login/otp-request", {
            credential: identifier
        });
        return response.data;
    },

    verifyOtp: async (identifier: string, otp: string) => {
        const response = await apiClient.post("/auth/verify-otp", {
            credential: identifier,
            otp: otp,
            purpose: "LOGIN"
        });
        return response.data;
    }
};