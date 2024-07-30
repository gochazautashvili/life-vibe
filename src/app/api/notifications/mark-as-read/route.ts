import { validateRequest } from "@/auth";
import db from "@/lib/db";

export async function PATCH() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized!" }, { status: 500 });
    }

    await db.notification.updateMany({
      where: { recipientId: user.id, read: false },
      data: { read: true },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
