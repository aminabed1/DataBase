// src/features/matches/hooks/useMatches.ts
import { useQuery } from "@tanstack/react-query";
import { getMatches, getMatchDetails } from "../services/matches.service";
import { SportType } from "../types";

export function useMatches(sport: SportType, leagueId: string) {
    return useQuery({
        queryKey: ["matches", sport, leagueId],
        queryFn: () => getMatches(sport, leagueId),
    });
}

export function useMatchDetails(matchId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["match-details", matchId],
        queryFn: () => getMatchDetails(matchId),
        enabled, // فقط وقتی کارت باز شد fetch کن
        staleTime: 60_000,
    });
}
