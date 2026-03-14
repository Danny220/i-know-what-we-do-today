// Query keys
import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const groupKeys = {
  all: ["groups"],
};

// Fetch all groups
const fetchGroups = async () => {
  const { data } = await apiClient.get("/groups");
  return data;
};

// Hook to get groups
export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.all,
    queryFn: fetchGroups,
  });
};

// Create a new group
const createGroup = async (groupData) => {
  const { data } = await apiClient.post("/groups", groupData);
  return data;
};

// Hook to create a group
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      // Invalidate and refetch groups list
      void queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
};
