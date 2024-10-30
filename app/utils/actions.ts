"use server";

import webpush from "web-push";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";

webpush.setVapidDetails(
  `mailto:${process.env.NOTIFY_EMAIL ?? ""}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: PushSubscription) {
  const userId = await validateSession();

  await db.subscription.create({
    data: {
      userId: userId,
      sub: JSON.stringify(sub),
    },
  });

  return { success: true };
}

export async function unsubscribeUser() {
  const userId = await validateSession();

  await db.subscription.deleteMany({
    where: {
      userId,
    },
  });

  return { success: true };
}

export async function sendNotification(title: string, message: string, targetUsersIds: string[]) {
  const subscriptions = await db.subscription.findMany({
    where: {
      userId: {
        in: targetUsersIds,
      },
    },
  });

  if (subscriptions.length === 0) {
    console.error("No subscription available");
  }

  subscriptions.forEach(async ({ sub }) => {
    try {
      await webpush.sendNotification(
        JSON.parse(sub),
        JSON.stringify({
          title,
          body: message,
        })
      );
      return { success: true };
    } catch (error) {
      console.error("Error sending push notification:", error);
      return { success: false, error: "Failed to send notification" };
    }
  });
}
