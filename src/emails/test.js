const { error } = require('console');
const { getUnreadMessages,
    getMessageSubject,
    getMessageAttachments,
    markMessageAsRead, listOfLabels } = require('./services/gmailApiServices');

const { authorize } = require('./services/googleApiAuthService');

async function testing() {
    /* await authorize().catch(console.error);
    //await listOfLabels(auth).then().catch(console.error);

    let message = 'TO: omaimaouahline@gmail.com\n'+
    'Subject: Test Email\n'+
    'Content-Type: text/html; charset=utf-8\n\n'+
    'Hello World';
    //await sendEmail(auth, message).catch(console.error);
    //await getLatestMessage(auth).catch(error); */
    let auth = await authorize().then().catch(console.error)
    const unreadMessages = await getUnreadMessages(auth)
    console.log(unreadMessages)
    /* const lables = await listOfLabels(auth)
    console.log(labels) */

}



testing().catch(console.error)