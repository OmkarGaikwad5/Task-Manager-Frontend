import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function PushButton() {
  const [supported, setSupported] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    // Check if push notifications are supported
    setSupported("serviceWorker" in navigator && "PushManager" in window);
  }, []);

  const subscribe = async () => {
    try {
      // Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js");

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notifications denied");
        return;
      }

      // Get VAPID key from env
      const key = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!key) {
        toast.error("Push not configured on server");
        return;
      }

      // Subscribe user
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });

      // Send subscription to backend
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api/push/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(subscription),
        }
      );

      if (res.ok) {
        setEnabled(true);
        toast.success("Subscribed successfully!");
      } else {
        toast.error("Failed to subscribe on server");
      }
    } catch (err) {
      console.error(err);
      toast.error("Subscription failed: " + err.message);
    }
  };

  const testPush = async () => {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api/push/test",
        { method: "POST", credentials: "include" }
      );
      if (res.ok) toast.success("Push sent successfully!");
      else toast.error("Push failed");
    } catch (err) {
      console.error(err);
      toast.error("Push request failed: " + err.message);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      <Button
        onClick={subscribe}
        variant="secondary"
        className="w-full md:w-auto"
      >
        {enabled ? "✅ Subscribed" : "🔔 Enable Notifications"}
      </Button>
      <Button
        onClick={testPush}
        variant="outline"
        className="w-full md:w-auto"
        disabled={!enabled}
      >
        Push Notifications
      </Button>
    </div>
  );
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
