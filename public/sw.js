self.addEventListener('push', function (event) {
  const data = event.data
    ? event.data.json()
    : {
        title: "Caravaggio's Atelier",
        body: 'Hai appuntamenti da chiudere oggi. Tocca per confermare incasso e % studio.',
        appointmentId: null,
      };

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [150, 80, 150],
    data: {
      url: data.appointmentId ? `/?checkout=${data.appointmentId}` : '/?checkout=pending',
    },
    actions: [
      { action: 'open', title: 'Chiudi Appuntamento' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'OPEN_CHECKOUT', url: targetUrl });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});