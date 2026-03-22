import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const messagesKeys = {
  all: (groupId) => ["messages", groupId],
};

const fetchMessages = async (groupId) => {
  const { data } = await apiClient.get(`/groups/${groupId}/messages`);
  return data;
};

export const useMessages = (groupId) =>
  useQuery({
    queryKey: messagesKeys.all(groupId),
    queryFn: () => fetchMessages(groupId),
    enabled: !!groupId,
    refetchInterval: 10_000,
  });

const postMessage = async ({ groupId, content }) =>
  apiClient.post(`/groups/${groupId}/messages`, { content });

export const usePostMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMessage,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: messagesKeys.all(variables.groupId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Error occurred during message posting!",
      );
    },
  });
};
