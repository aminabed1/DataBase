// src/features/matches/services/match.service.ts
import apiClient from "@/services/client";

export type SportType = "football" | "basketball" | "volleyball";

export interface Match {
    id: string;
    sport: SportType;
    league: string;
    teamHome: { name: string; logo: string };
    teamAway: { name: string; logo: string };
    date: string;
    time: string;
    location: { city: string; province: string; stadium: string };
    details?: {
        capacity: number;
        remainingSeats: number;
        amenities: string[];
        estimatedPrice: { min: number; max: number };
    };
}

export const matchService = {
    // اتصال مستقیم به بک‌اند
    getAvailableMatches: async () => {
        const response = await apiClient.get("/matches");
        return response.data;
    }
};

export const LEAGUES = {
    football: ["All", "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Persian Gulf Pro League"],
    basketball: ["All", "NBA", "Liga ACB", "Lega Basket Serie A"],
    volleyball: ["All", "SuperLega", "PlusLiga"]
};