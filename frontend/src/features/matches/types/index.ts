// src/features/matches/types/index.ts
export type SportType = "football" | "basketball" | "volleyball";

export interface League {
    id: string;
    name: string;
    country: string;
    sport: SportType;
    logoSlug: string;
}

export interface Team {
    id: string;
    name: string;
    logoSlug: string;
}

export interface Match {
    id: string;
    sport: SportType;
    league_id: string;
    home_team: Team;
    away_team: Team;
    city: string;
    province: string;
    stadium: string;
    match_datetime: string; // ISO
}

// اطلاعات اضافه که فقط موقع باز شدن کارت fetch میشه
export interface MatchDetails {
    match_id: string;
    remaining_capacity: number;
    total_capacity: number;
    facilities: string[];
    min_price: number;
    max_price: number;
}
