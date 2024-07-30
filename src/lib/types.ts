import { Prisma } from "@prisma/client";

export const getUserDataSelect = (loggedUserId: string) => {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: { followerId: loggedUserId },
      select: { followerId: true },
    },
    _count: {
      select: { followers: true, posts: true },
    },
  } satisfies Prisma.UserSelect;
};

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export const getPostDataInclude = (loggedUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedUserId,
      },
      select: { userId: true },
    },
    bookmarks: {
      where: {
        userId: loggedUserId,
      },
      select: { userId: true },
    },
    _count: {
      select: { likes: true, comments: true },
    },
  } satisfies Prisma.PostInclude;
};

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export const getCommentDataInclude = (loggedUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedUserId),
    },
  } satisfies Prisma.CommentInclude;
};

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: { content: true },
  },
} satisfies Prisma.NotificationInclude;

export type notificationsData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: notificationsData[];
  nextCursor: string | null;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessagesCountInfo {
  unreadCount: number;
}
