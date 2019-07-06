const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.newUpdateReceived = functions.firestore.document('notifications/{notificationId}').onCreate((event, context) => {
    var notificationData = event.data(); //.data.data();
    console.log(notificationData);
    //var message = "New Todo Added : " + newValue.title;
    pushMessage(notificationData);
    return true;
});

// Function to push notification to a topic.
function pushMessage(notificationData) {
    var payload = {
        notification: {
            title: notificationData["title"],
            body: notificationData["body"],
        }
    };

    admin.messaging().sendToTopic(notificationData["topic"], payload)
        .then((response) => {
            console.log("Successfully sent message:", response);
            return null;
        })
        .catch((error) => {
            console.log("Error sending message:", error);
        });
}