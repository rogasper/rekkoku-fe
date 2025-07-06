import useUser from "@/store/useUser";
import { Role } from "@/constants/enums";

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useUser();

  return {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === Role.ADMIN,
    hasRole: (role: Role) => user?.role === role,
    checkOwnership: (resourceUserId: string) => user?.userId === resourceUserId,
    checkAdminOrOwnership: (resourceUserId: string) =>
      user?.role === Role.ADMIN || user?.userId === resourceUserId,
    setAuth,
    clearAuth,
    logout: clearAuth, // alias untuk clearAuth
  };
};
