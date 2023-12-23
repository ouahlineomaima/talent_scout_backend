const authorize = require('./services/googleApiAuthService');
const {listOfLabels, sendEmail, getUnreadMessages} = require('./services/gmailApiServices');
const { error } = require('console');

async function testing(){
    await authorize().catch(console.error);
    //await listOfLabels(auth).then().catch(console.error);

    let message = 'TO: omaimaouahline@gmail.com\n'+
    'Subject: Test Email\n'+
    'Content-Type: text/html; charset=utf-8\n\n'+
    'Hello World';
    //await sendEmail(auth, message).catch(console.error);
    //await getLatestMessage(auth).catch(error);
}

authorize().catch(console.error)
//testing().catch(console.error)