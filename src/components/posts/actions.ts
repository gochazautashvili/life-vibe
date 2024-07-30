"use server";

import { validateRequest } from "@/auth";
import db from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";

export const deletePost = async (id: string) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post no found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await db.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
};
