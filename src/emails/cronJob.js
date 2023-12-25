const nodeCron = require('node-cron');
const { getUnreadMessages,
    getMessageSubject,
    getMessageAttachments,
    markMessageAsRead } = require('./services/gmailApiServices');

const { authorize } = require('./services/googleApiAuthService');
const Recruitment = require('../models/Recruitment')
const Applicant = require('../models/Applicant')


// Define the cron job to run at 6 am every day '0 6 * * *'
function startCronJob() {
    
    nodeCron.schedule('9 15 * * *', async () => {
        try {
            const recruitments = await Recruitment.find();
            let auth = await authorize().then().catch(console.error)
            for (const recruitment of recruitments) {
                const { emailSubject, _id } = recruitment;
                try {
                    const unreadMessages = await getUnreadMessages(auth);
                    if(unreadMessages){
                        for (const message of unreadMessages) {
                            const subject = await getMessageSubject(auth, message.id);
                            if (subject === emailSubject) {
                                const attachments = await getMessageAttachments(auth, message.id, '');
                                const newApplicant = new Applicant({
                                    idRecruitment: _id,
                                    resume: attachments.find(att => att.filename.endsWith('resume.pdf'))?.base64Data || '',
                                    coverLetter: attachments.find(att => att.filename.endsWith('cover_letter.pdf'))?.base64Data|| '',
                                });
                                const savedApplicant = await newApplicant.save();
                                recruitment.applicants.push(savedApplicant._id);
                                await markMessageAsRead(auth, message.id);
                            }                          
                        }
                        await recruitment.save();
                    }
                    

                } catch (err) {
                    console.error(`Error processing recruitment ${_id}: ${err.message}`);
                }
            }
            console.log('Cron job executed successfully');

            
        } catch (error) {
            console.error('Cron job error:', error.message);
        }
    });
}

module.exports = { startCronJob };

