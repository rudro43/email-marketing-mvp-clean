const axios = require('axios');
const User = require('../models/User');

const tokenUrl = `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/token`;
const profileUrl = `https://graph.microsoft.com/v1.0/me`;

const getToken = async (code) => {
  const res = await axios.post(tokenUrl, new URLSearchParams({
    client_id: process.env.OUTLOOK_CLIENT_ID,
    client_secret: process.env.OUTLOOK_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: 'offline_access User.Read Mail.Send',
  }).toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return res.data;
};

const loginWithMicrosoft = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenData = await getToken(code);
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    const profile = await axios.get(profileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { id, displayName, mail, userPrincipalName } = profile.data;
    const email = mail || userPrincipalName;

    let user = await User.findOneAndUpdate(
      { microsoftId: id },
      {
        name: displayName,
        email,
        accessToken,
        refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    res.status(500).json({ success: false, error: 'OAuth login failed' });
  }
};

module.exports = { loginWithMicrosoft };
