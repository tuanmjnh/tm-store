// Replace with your FedCM and Google OAuth credentials
const fedCmBaseUrl = 'http://localhost:8000/connect/google-add';
const googleClientId = '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com';
const googleClientSecret = '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';
const googleRedirectUri = 'http://localhost:8000/connect/google-add';

// Function to initiate the OAuth flow
function initiateOAuth() {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;


  window.open(googleAuthUrl, 'name', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=600,width=450');
}

// Callback function to handle the OAuth response
function handleOAuthCallback(code) {
  fetch(`${fedCmBaseUrl}/oauth2/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `code=${code}&client_id=${googleClientId}&client_secret=${googleClientSecret}&redirect_uri=${googleRedirectUri}`,
  })
    .then(response => response.json())
    .then(data => {
      // Handle the FedCM token
      const fedCmToken = data.access_token;
      console.log(fedCmToken)
      // Use the FedCm token to access protected resources
      // ...
    })
    .catch(error => {
      console.error('Error obtaining FedCM token:', error);
    });
}

// Check if an authorization code is present in the URL
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get('code');
console.log(authorizationCode)
if (authorizationCode) {
  handleOAuthCallback(authorizationCode);
} else {
  initiateOAuth();
}