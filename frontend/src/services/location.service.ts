// src/services/location.service.ts
import apiClient from "./client";

export interface LocationItem {
    id: string;
    name: string;
}

export const locationService = {
    // گرفتن لیست کل استان‌ها
    getProvinces: async (): Promise<LocationItem[]> => {
        // --- دیتای فیک (تا زمان آماده شدن بک‌اند) ---
        return [
            { id: "1", name: "Tehran" },
            { id: "2", name: "Khorasan Razavi" },
            { id: "3", name: "Isfahan" },
            { id: "4", name: "Ardabil" },
        ];

        // --- کد واقعی (بعداً کامنت این قسمت رو باز کن) ---
        // const response = await apiClient.get("/locations/provinces");
        // return response.data;
    },

    // گرفتن لیست شهرهای یک استان خاص
    getCitiesByProvince: async (provinceId: string): Promise<LocationItem[]> => {
        // --- دیتای فیک (تا زمان آماده شدن بک‌اند) ---
        const mockCities: Record<string, LocationItem[]> = {
            "1": [{ id: "101", name: "Tehran" }, { id: "102", name: "Damavand" }],
            "2": [{ id: "201", name: "Mashhad" }, { id: "202", name: "Sabzevar" }],
            "3": [{ id: "301", name: "Isfahan" }, { id: "302", name: "Kashan" }],
            "4": [{ id: "401", name: "Ardabil" }, { id: "402", name: "Parsabad" }],
        };
        return mockCities[provinceId] || [];

        // --- کد واقعی (بعداً کامنت این قسمت رو باز کن) ---
        // const response = await apiClient.get(`/locations/cities?provinceId=${provinceId}`);
        // return response.data;
    }
};