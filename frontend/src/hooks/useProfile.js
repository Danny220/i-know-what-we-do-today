import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const profileKeys = {
  all: (userId) => ["profile", userId],
};

const fetchProfile = async (userId) => {
  const { data } = await apiClient.get(`/profiles/${userId}`);
  return data;
};

export const useProfile = (userId) =>
  useQuery({
    queryKey: profileKeys.all(userId),
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
  });

const updateProfile = async ({ profileData }) =>
  await apiClient.put("/profiles/me", profileData);

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all() });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });
};
