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
    sendNewPhoneOtp: async (phoneValue: string) => {
        // Send both to avoid naming mismatch in backend DTO
        const response = await apiClient.post("/users/me/phone/change/new/send-otp", { 
            phone: phoneValue, 
            phoneNumber: phoneValue 
        });
        return response.data;
    },
    verifyNewPhone: async (data: { identifier: string; otp: string }) => {
        const response = await apiClient.post("/users/me/phone/change/new/verify-otp", {
            credential: data.identifier, // The backend expects 'credential' instead of 'identifier' or 'phone'
            otp: data.otp,
            purpose: "CHANGE_PHONE"      // The backend requires the 'purpose' field
        });
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
    sendNewEmailOtp: async (emailValue: string) => {
        const response = await apiClient.post("/users/me/email/change/new/send-otp", { 
            email: emailValue 
        });
        return response.data;
    },
    verifyNewEmail: async (data: { identifier: string; otp: string }) => {
        const response = await apiClient.post("/users/me/email/change/new/verify-otp", {
            credential: data.identifier, // The backend expects 'credential'
            otp: data.otp,
            purpose: "CHANGE_EMAIL"      // The backend requires the 'purpose' field
        });
        return response.data;
    },

    changePassword: async (payload: any) => {
        const response = await apiClient.patch("/users/me/password", payload);
        return response.data;
    }
};