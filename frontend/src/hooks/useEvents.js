import apiClient from "../clients/apiClient.js";
import { useQuery } from "@tanstack/react-query";

export const eventKeys = {
  all: (groupId) => ["events", groupId],
};

// Fetch events
const fetchEvents = async (groupId) => {
  const { data } = await apiClient.get(`/groups/${groupId}/events`);
  return data;
};

export const useEvents = (groupId) =>
  useQuery({
    queryKey: eventKeys.all(groupId),
    queryFn: () => fetchEvents(groupId),
    enabled: !!groupId,
  });
