"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser } from "@/app/utils/actions";
import Spinner from "../spinner/spinner";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState<boolean>();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [subscription]);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    setSubscription(sub);
    await subscribeUser(sub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  if (isSupported === false) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <label style={{ display: "flex", gap: "8px" }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <input
          type="checkbox"
          checked={!!subscription}
          onChange={(e) => {
            setIsLoading(true);
            e.target.checked ? subscribeToPush() : unsubscribeFromPush();
          }}
        />
      )}
      Push Notifications
    </label>
  );
}
