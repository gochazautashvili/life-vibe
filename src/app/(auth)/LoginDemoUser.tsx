"use client";
import LoadingButton from "@/components/LoadingButton";
import { useTransition } from "react";
import { loginWithDemoUser } from "./actions";

const LoginDemoUser = () => {
  const [isPending, startTransition] = useTransition();

  const handleLoginWithDemoUser = () => {
    startTransition(async () => {
      await loginWithDemoUser();
    });
  };

  return (
    <LoadingButton
      onClick={handleLoginWithDemoUser}
      type="button"
      loading={isPending}
      className="w-full border-2 border-primary bg-transparent text-black hover:text-white"
    >
      Log in with demo user
    </LoadingButton>
  );
};

export default LoginDemoUser;
