let isRegistered = false;

function registerServiceWorker() {
  if (isRegistered) {
    return
  }

  navigator.serviceWorker
    .register("/service-worker.js", { scope: '.' })
    .then((registration) => {
      return registration.pushManager
        .getSubscription()
        .then(async (subscription) => {
          if (subscription) {
            return subscription;
          }
          const response = await fetch("/vapidPublicKey");
          const vapidPublicKey = await response.text();
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        });
    })
    .then((subscription) => {
      fetch("/register", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });

      isRegistered = true

      document.getElementById("notification").addEventListener('click', () => {
        const payload = "notification"
        const delay = 10
        const ttl = 20

        fetch("/sendNotification", {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            subscription,
            payload,
            delay,
            ttl,
          }),
        });
      })
    });


  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}