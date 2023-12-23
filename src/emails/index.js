const nodeCron = require('node-cron');
const { getUnreadMessages,
    getMessageSubject,
    getMessageAttachments,
    markMessageAsRead } = require('./services/gmailApiServices'); 

// Define the cron job to run at 6 am every day
nodeCron.schedule('0 6 * * *', async () => {
  try {
    // Fetch all recruitments
    const recruitments = await Recruitment.find();

    // Iterate through each recruitment and fetch emails
    for (const recruitment of recruitments) {
      const { trackedEmail, emailSubject } = recruitment;

      // Implement the function to fetch emails based on trackedEmail and emailSubject
      const matchingEmails = await fetchEmailsForRecruitment(trackedEmail, emailSubject);

      // Do something with the matching emails, for example, update the Recruitment model
      await Recruitment.findByIdAndUpdate(recruitment._id, { $push: { matchingEmails } });
    }

    console.log('Cron job executed successfully');
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
});


