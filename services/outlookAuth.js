const axios = require('axios');
require('dotenv').config();

async function getAccessToken() {
  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

  const params = new URLSearchParams();
  params.append('client_id', process.env.MS_CLIENT_ID);
  params.append('client_secret', process.env.MS_CLIENT_SECRET);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', process.env.REFRESH_TOKEN);
  params.append('redirect_uri', process.env.MS_REDIRECT_URI);
  params.append('scope', 'Mail.Send offline_access User.Read');

  const res = await axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return res.data.access_token;
}

module.exports = { getAccessToken };
