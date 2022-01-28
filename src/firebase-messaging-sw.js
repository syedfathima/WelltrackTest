 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

 firebase.initializeApp({
	apiKey: "AIzaSyBZcFc5qTFVo3iyMaqodyhvZcRdBxVW4yI",
	authDomain: "welltrack-638e4.firebaseapp.com",
	projectId: "welltrack-638e4",
	storageBucket: "welltrack-638e4.appspot.com",
	messagingSenderId: "5299403143",
	appId: "1:5299403143:web:a706a2c8f12713a8653b22"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
	self.clients
		.matchAll({
			type: 'window',
			includeUncontrolled: true,
		})
		.then(windowClients => {
			let matchingClient = null;

			for (let i = 0; i < windowClients.length; i += 1) {
				const windowClient = windowClients[i];
				if (windowClient.url.indexOf(self.location.origin) >= 0) {
					matchingClient = windowClient;
					break;
				}
			}
			if (matchingClient) {
				matchingClient.postMessage(payload);
			}
		})
		.then(() => {
      self.registration.showNotification(payload.data.notificationTitle, {
				body: payload.data.twi_body,
			});
		});
});

self.addEventListener('notificationclick', function(event) {
	const promiseChain1 = self.clients
		.matchAll({
			type: 'window',
			includeUncontrolled: true,
		})
		.then(windowClients => {
			let matchingClient = null;

			for (let i = 0; i < windowClients.length; i += 1) {
				const windowClient = windowClients[i];
				if (windowClient.url.indexOf(self.location.origin) >= 0) {
					matchingClient = windowClient;
					break;
				}
			}

			if (matchingClient) {
				if ('navigate' in matchingClient) {
					return matchingClient.focus();
				}
				return matchingClient.focus();
			}
			return self.clients.openWindow(self.location.origin);
		});

	event.waitUntil(promiseChain1);
});
