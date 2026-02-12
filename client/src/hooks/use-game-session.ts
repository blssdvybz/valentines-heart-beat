import { useMutation } from "@tanstack/react-query";
import { api, type InsertGameSession } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useCreateGameSession() {
  return useMutation({
    mutationFn: async (data: InsertGameSession) => {
      const res = await apiRequest(
        api.sessions.create.method,
        api.sessions.create.path,
        data
      );
      return res.json();
    },
    onError: (error) => {
      console.error("Failed to save game session:", error);
      // We don't want to block the user experience if saving stats fails
    }
  });
}
