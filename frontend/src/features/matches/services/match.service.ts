// src/features/matches/services/match.service.ts

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
    // اطلاعات بیشتر برای زمانی که کارت باز میشه (بعداً از API جداگانه میاد)
    details?: {
        capacity: number;
        remainingSeats: number;
        amenities: string[];
        estimatedPrice: { min: number; max: number };
    };
}

// دیتای فیک برای تست UI
export const MOCK_MATCHES: Match[] = [
    {
        id: "m1",
        sport: "football",
        league: "Premier League",
        teamHome: { name: "Arsenal", logo: "https://resources.premierleague.com/premierleague/badges/50/t3.png" },
        teamAway: { name: "Chelsea", logo: "https://resources.premierleague.com/premierleague/badges/50/t8.png" },
        date: "2026-10-15",
        time: "18:30",
        location: { city: "London", province: "Greater London", stadium: "Emirates Stadium" },
        details: { capacity: 60272, remainingSeats: 1200, amenities: ["VIP Lounge", "Parking", "Fast Food"], estimatedPrice: { min: 50, max: 250 } }
    },
    {
        id: "m2",
        sport: "football",
        league: "La Liga",
        teamHome: { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png" },
        teamAway: { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/100px-FC_Barcelona_%28crest%29.svg.png" },
        date: "2026-10-22",
        time: "21:00",
        location: { city: "Madrid", province: "Madrid", stadium: "Santiago Bernabéu" },
        details: { capacity: 81044, remainingSeats: 450, amenities: ["VIP Lounge", "Museum", "Restaurant"], estimatedPrice: { min: 100, max: 500 } }
    },
    {
        id: "m3",
        sport: "basketball",
        league: "NBA",
        teamHome: { name: "Lakers", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/100px-Los_Angeles_Lakers_logo.svg.png" },
        teamAway: { name: "Warriors", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/100px-Golden_State_Warriors_logo.svg.png" },
        date: "2026-11-05",
        time: "19:00",
        location: { city: "Los Angeles", province: "California", stadium: "Crypto.com Arena" },
        details: { capacity: 20000, remainingSeats: 3000, amenities: ["Courtside Seats", "Bar", "Merch Shop"], estimatedPrice: { min: 80, max: 600 } }
    },
    {
        id: "m4",
        sport: "volleyball",
        league: "SuperLega",
        teamHome: { name: "Trentino", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/db/Trentino_Volley_logo.svg/100px-Trentino_Volley_logo.svg.png" },
        teamAway: { name: "Lube Civitanova", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Associazione_Sportiva_Volley_Lube_logo.svg/100px-Associazione_Sportiva_Volley_Lube_logo.svg.png" },
        date: "2026-11-12",
        time: "17:30",
        location: { city: "Trento", province: "Trentino", stadium: "PalaTrento" },
        details: { capacity: 4000, remainingSeats: 850, amenities: ["Parking", "Snack Bar"], estimatedPrice: { min: 20, max: 80 } }
    }
];

export const LEAGUES = {
    football: ["All", "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"],
    basketball: ["All", "NBA", "Liga ACB", "Lega Basket Serie A"],
    volleyball: ["All", "SuperLega", "PlusLiga"]
};