// src/services/location.service.ts
import apiClient from "./client";

export interface LocationItem {
    id: string;
    name: string;
}

export const locationService = {
    getProvinces: async (): Promise<LocationItem[]> => {
        try {
            const response = await apiClient.get("/locations/provinces");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch provinces", error);
            return [];
        }
    },

    getCitiesByProvince: async (provinceId: string): Promise<LocationItem[]> => {
        try {
            const response = await apiClient.get(`/locations/cities?provinceId=${provinceId}`);
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch cities", error);
            return [];
        }
    }
};