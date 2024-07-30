"use server";

import { validateRequest } from "@/auth";
import db from "@/lib/db";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import { updateProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
  const validateValues = updateProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updateUser = await db.$transaction(async (tx) => {
    const updateUser = await tx.user.update({
      where: { id: user.id },
      data: validateValues,
      select: getUserDataSelect(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validateValues.displayName,
      },
    });

    return updateUser;
  });

  return updateUser;
};
