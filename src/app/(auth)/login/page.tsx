import { Metadata } from "next";
import LoginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import GoogleButton from "./GoogleButton";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-3xl font-bold">Login to Life Vibe</h1>
          <div className="space-y-5">
            <GoogleButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted"></div>
              <span>OR</span>
              <div className="h-px flex-1 bg-muted"></div>
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&rsquo;t have an account? Sign up
            </Link>
          </div>
        </div>
        <div className="relative hidden w-1/2 md:block">
          <Image
            fill
            priority
            placeholder="blur"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={LoginImage}
            alt="sign up image"
            className="w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
