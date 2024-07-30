import db from "@/lib/db";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header!" },
        { status: 404 },
      );
    }

    const unusedMedia = await db.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? { createdAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24) } }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    new UTApi().deleteFiles(
      unusedMedia.map(
        (m) => m.url.split(`/a/${process.env.UPLOADTHING_APP_ID}/`)[1],
      ),
    );

    await db.media.deleteMany({
      where: { id: { in: unusedMedia.map((m) => m.id) } },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
