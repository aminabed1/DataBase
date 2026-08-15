import apiClient from "@/services/client";

export const walletService = {
    getMyWallet: async () => {
        const response = await apiClient.get("/wallets/me");
        return response.data;
    },
    topUpWallet: async (data: { amount: number, paymentMethodId: number }) => {
        const response = await apiClient.post("/wallets/me/top-up", data);
        return response.data;
    },
    getMyTransactions: async () => {
        const response = await apiClient.get("/wallets/me/transactions");
        return response.data;
    },
    getPaymentMethods: async () => {
        const response = await apiClient.get("/payments/methods");
        return response.data;
    }
};