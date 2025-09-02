self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Default Title",
    body: "Default body",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png", 
      badge: "/badge.png", 
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
