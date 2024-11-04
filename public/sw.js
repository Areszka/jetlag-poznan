self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url,
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  const urlToOpen = event.notification.data?.url || "https://jetlag-poznan.vercel.app";

  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow(urlToOpen));
});
