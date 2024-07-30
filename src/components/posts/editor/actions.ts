"use server";

import { validateRequest } from "@/auth";
import db from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export const submitPost = async (input: {
  content: string;
  mediaIds: string[];
}) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await db.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
};
