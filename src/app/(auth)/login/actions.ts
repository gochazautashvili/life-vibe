"use server";
import db from "@/lib/db";
import { loginSchema, LoginType } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export const login = async (
  credentials: LoginType,
): Promise<{ error: string }> => {
  try {
    const { password, username } = loginSchema.parse(credentials);

    const existingUser = await db.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Incorrect username or password" };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return { error: "Incorrect username or password" };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Something went wrong :(, Please try again" };
  }
};
