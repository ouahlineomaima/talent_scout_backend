const { google } = require('googleapis');
const { version } = require('os');
const fs = require('fs');

async function listOfLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const response = await gmail.users.labels.list({
        userId: 'me',
    });

    const labels = response.data.labels;
    if (!labels || labels.length == 0) {
        console.log('No labels are found');
        return;
    }
    console.log('Lables: ');
    labels.forEach(label => {
        console.log(`- ${label.name} - ${label.id}`);
    });
    return labels;
}

async function sendEmail(auth, content) {
    const gmail = google.gmail({ version: 'v1', auth });
    const encodedMessage = Buffer.from(content).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });

    console.log(res.data);
    return res.data;
}

async function getUnreadMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        labelIds: ['INBOX', 'UNREAD']
    });

    const unreadMessages = res.data.messages;

    return unreadMessages;

}

async function getMessageSubject(auth, messageId) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId
    });

    const subject = res.data.payload.headers.find(header => header.name === 'Subject');
    return subject ? subject.value : null;
}

async function getMessageAttachments(auth, messageId) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.messages.get({
            userId: 'me',
            id: messageId
        });

        const parts = res.data.payload.parts;
        if (!parts || parts.length === 0) {
            console.log('No attachments found for the message.');
            return [];
        }

        const pdfAttachments = await Promise.all(parts
            .filter(part => part.filename && part.body && part.body.attachmentId && part.mimeType === 'application/pdf')
            .filter(part => {
                const lowercasedFilename = part.filename.toLowerCase();
                return lowercasedFilename.endsWith('resume.pdf') || lowercasedFilename.endsWith('cover_letter.pdf');
            })
            .map(async part => {
                const attachment = await getAttachmentContent(gmail, messageId, part.body.attachmentId);
                return {
                    filename: part.filename,
                    mimeType: part.mimeType,
                    base64Data: attachment.toString('base64')
                };
            }));

        console.log(pdfAttachments);

        return pdfAttachments;
    } catch (error) {
        console.error('Error getting attachments:', error.message);
        return [];
    }
}

async function getAttachmentContent(gmail, messageId, attachmentId) {
    const response = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachmentId,
    });

    return Buffer.from(response.data.data, 'base64');
}

async function markMessageAsRead(auth, messageId) {
    const gmail = google.gmail({ version: 'v1', auth });
    await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
            removeLabelIds: ['UNREAD']
        }
    });
}

module.exports = {
    listOfLabels: listOfLabels,
    sendEmail: sendEmail,
    getUnreadMessages: getUnreadMessages,
    getMessageSubject: getMessageSubject,
    getMessageAttachments: getMessageAttachments,
    markMessageAsRead: markMessageAsRead
};