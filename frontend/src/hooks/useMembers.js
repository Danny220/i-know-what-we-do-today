import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const memberKeys = {
  all: (groupId) => ["members", groupId],
};

const fetchMembers = async (groupId) => {
  const { data } = await apiClient.get(`/groups/${groupId}/members`);
  return data;
};

export const useMembers = (groupId) =>
  useQuery({
    queryKey: memberKeys.all(groupId),
    queryFn: () => fetchMembers(groupId),
    enabled: !!groupId,
  });

const removeMember = ({ groupId, userId }) =>
  apiClient.delete(`/groups/${groupId}/members/${userId}`);

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: memberKeys.all() });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Error occurred during member removal!",
      );
    },
  });
};
