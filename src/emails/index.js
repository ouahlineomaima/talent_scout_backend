const authorize = require('./services/googleApiAuthService');
const {listOfLabels, sendEmail, getUnreadMessages} = require('./services/gmailApiServices');
const { error } = require('console');

async function testing(){
    let auth = await authorize().then().catch(console.error);
    //await listOfLabels(auth).then().catch(console.error);

    let message = 'TO: omaimaouahline@gmail.com\n'+
    'Subject: Test Email\n'+
    'Content-Type: text/html; charset=utf-8\n\n'+
    'Hello World';
    //await sendEmail(auth, message).catch(console.error);
    await getLatestMessage(auth).catch(error);
}

testing().catch(console.error)