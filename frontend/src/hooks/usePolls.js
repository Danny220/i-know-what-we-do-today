import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const pollKeys = {
  all: (groupId) => ["polls", groupId],
};

// Fetch polls
const fetchPolls = async (groupId) => {
  const { data } = await apiClient.get(`/groups/${groupId}/polls`);
  return data;
};

export const usePolls = (groupId) => {
  return useQuery({
    queryKey: pollKeys.all(groupId),
    queryFn: () => fetchPolls(groupId),
    enabled: !!groupId,
  });
};

// Create a new poll
const createPoll = async ({ groupId, pollData }) => {
  const { data } = await apiClient.post(`/groups/${groupId}/polls`, pollData);
  return data;
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPoll,
    onSuccess: (data, variables) => {
      // Invalidate and refetch polls list
      void queryClient.invalidateQueries({
        queryKey: pollKeys.all(variables.groupId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Error occurred during poll creation!",
      );
    },
  });
};

// Finalize a poll
const finalizePoll = async ({ groupId, pollId }) => {
  const { data } = await apiClient.post(
    `/groups/${groupId}/polls/${pollId}/finalize`,
  );
  return data;
};

export const useFinalizePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizePoll,
    onSuccess: (_, variables) => {
      // Invalidate and refetch polls list
      void queryClient.invalidateQueries({
        queryKey: pollKeys.all(variables.groupId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Error occurred during poll finalization!",
      );
    },
  });
};

// Vote on a poll
const voteOnPoll = async ({ groupId, pollId, optionId }) => {
  const { data } = await apiClient.post(
    `/groups/${groupId}/polls/${pollId}/vote`,
    { optionId },
  );

  return data;
};

export const useVoteOnPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteOnPoll,
    onSuccess: (_, variables) => {
      // Invalidate and refetch polls list
      void queryClient.invalidateQueries({
        queryKey: pollKeys.all(variables.groupId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Error occurred during vote!",
      );
    },
  });
};
