// src/features/auth/services/auth.service.ts
import apiClient from "@/services/client";

export const authService = {
    register: async (payload: any) => {
        const nameParts = payload.name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-";

        const requestBody = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: payload.phone,
            email: payload.email,
            password: payload.password,
            confirmPassword: payload.password, 
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
        const response = await apiClient.post("/auth/forgot-password", { 
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