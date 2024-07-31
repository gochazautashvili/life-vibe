"use server";
import { lucia, validateRequest } from "@/auth";
import db from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";

export const logout = async () => {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
};

export const loginWithDemoUser = async () => {
  try {
    const { password, username } = loginSchema.parse({
      username: "demo-user",
      password: "demo-user-12345",
    });

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
