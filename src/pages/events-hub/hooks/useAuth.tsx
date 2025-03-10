
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export const useAuth = () => {
  return useAuthRedirect({
    redirectPath: "/auth",
    skipRedirect: false
  });
};
