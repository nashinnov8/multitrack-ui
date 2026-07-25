import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserBadges, getAllBadges } from "./api";

export const userKeys = {
  all: ["user"] as const,
  profile: (userId?: string) => [...userKeys.all, "profile", userId] as const,
  badges: (userId?: string) => [...userKeys.all, "badges", userId] as const,
  allBadges: () => ["badges", "all"] as const,
};

export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
  });
};

export const useUserBadges = (userId?: string) => {
  return useQuery({
    queryKey: userKeys.badges(userId),
    queryFn: () => getUserBadges(userId),
  });
};

export const useAllBadges = () => {
  return useQuery({
    queryKey: userKeys.allBadges(),
    queryFn: getAllBadges,
  });
};
