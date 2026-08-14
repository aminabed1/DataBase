import apiClient from "@/services/client";

export const userService = {
    getProfile: async () => {
        const response = await apiClient.get("/users/me");
        return response.data.data;
    },

    updateProfile: async (payload: { firstName?: string; lastName?: string; cityId?: number }) => {
        const response = await apiClient.patch("/users/me", payload);
        return response.data.data;
    },

    // --- Phone Change API Calls ---
    // sendOldPhoneOtp: async () => {
    //     const response = await apiClient.post("/users/me/phone/change/old/send-otp");
    //     return response.data;
    // },
    // verifyOldPhoneOtp: async (otp: string) => {
    //     const response = await apiClient.post("/users/me/phone/change/old/verify-otp", { otp });
    //     return response.data; // Includes temp token
    // },
    sendNewPhoneOtp: async (phone: string, tempToken: string) => {
        const response = await apiClient.post("/users/me/phone/change/new/send-otp", { phone }, {
            headers: { "X-Phone-Change-Token": tempToken }
        });
        return response.data;
    },
    verifyNewPhone: async (otp: string) => {
        const response = await apiClient.post("/users/me/phone/change/new/verify-otp", { otp });
        return response.data;
    },

    // --- Email Change API Calls ---
    // sendOldEmailOtp: async () => {
    //     const response = await apiClient.post("/users/me/email/change/old/send-otp");
    //     return response.data;
    // },
    // verifyOldEmailOtp: async (otp: string) => {
    //     const response = await apiClient.post("/users/me/email/change/old/verify-otp", { otp });
    //     return response.data;
    // },
    sendNewEmailOtp: async (email: string, tempToken: string) => {
        const response = await apiClient.post("/users/me/email/change/new/send-otp", { email }, {
            headers: { "X-Email-Change-Token": tempToken }
        });
        return response.data;
    },
    verifyNewEmail: async (otp: string) => {
        const response = await apiClient.post("/users/me/email/change/new/verify-otp", { otp });
        return response.data;
    }
};