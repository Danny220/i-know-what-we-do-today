import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pollKeys } from "./usePolls.js";
import toast from "react-hot-toast";

export const groupDetailKeys = {
  all: (groupId) => ["groupDetail", groupId],
};

// Fetch group detail
const fetchGroupDetail = async (groupId) => {
  const { data } = await apiClient.get(`/groups/${groupId}`);
  return data;
};

export const useGroupDetails = (groupId) =>
  useQuery({
    queryKey: groupDetailKeys.all(groupId),
    queryFn: () => fetchGroupDetail(groupId),
    enabled: !!groupId,
  });

// Update group
const updateGroup = async ({ groupId, groupData }) => {
  const { data } = await apiClient.put(`/groups/${groupId}`, groupData);
  return data;
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: pollKeys.all(variables.groupId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Error occurred during group update!",
      );
    },
  });
};

// Delete group
const deleteGroup = async ({ groupId }) => {
  const { data } = await apiClient.delete(`/groups/${groupId}`);
  return data;
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupDetailKeys.all() });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Error occurred during group deletion!",
      );
    },
  });
};
