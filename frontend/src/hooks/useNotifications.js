import apiClient from "../clients/apiClient.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const notificationsKeys = {
  all: ["notifications"],
};

const fetchNotifications = async () => {
  const { data } = await apiClient.get("/notifications");
  return data;
};

export const useNotifications = () =>
  useQuery({
    queryKey: notificationsKeys.all,
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
  });

const markAllAsRead = async () => {
  await apiClient.post("/notifications/mark-as-read");
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};
