import { validateRequest } from "@/auth";
import db from "@/lib/db";
import { NotificationCountInfo } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized!" }, { status: 500 });
    }

    const unreadCount = await db.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    const data: NotificationCountInfo = {
      unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
