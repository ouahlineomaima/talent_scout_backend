const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// Defining scopes
const SCOPE = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify"
];

// Fetching and storing tokens
const TOKEN_PATH = path.join(process.cwd(), 'credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials/credentials.json');

// Reading previously authorized credentials from the saved file
async function loadSavedCredentialsIfExists() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

// Saving credentials to the token file
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.web || keys.installed;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  });

  await fs.writeFile(TOKEN_PATH, payload);
}


// Authorization logic
async function authorize() {
  let client = await loadSavedCredentialsIfExists();

  if (client) {
    return client;
  }

  client = await authenticate({
    scopes: SCOPE,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}

module.exports = {
  authorize,
  SCOPE
};
