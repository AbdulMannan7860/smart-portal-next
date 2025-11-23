import { useAuthStore } from "@/app/store/authStore";

const useTempToken = () => {
  const token = useAuthStore((state) => state.tempToken);
  return token;
};

export default useTempToken;
