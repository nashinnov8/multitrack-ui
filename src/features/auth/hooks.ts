import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, verifyEmail } from "./api";
import { LoginRequest, RegisterRequest } from "./schema";
import { tokenStorage } from "@/lib/token";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      if (data.token && data.refreshToken) {
        tokenStorage.setTokens(data.token, data.refreshToken);
        queryClient.clear(); // Purge all cached queries from previous user sessions
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      return new Promise((resolve) => setTimeout(() => resolve(data), 1500));
    },
  });
};
