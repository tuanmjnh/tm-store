// JavaScript to connect to Google Drive
const SHARED_DRIVE_ID = 'MY_SHARED_GOOGLE_DRIVE_ID';  // Replace with your actual Shared Drive ID


function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}


function initClient() {
  gapi.client.init({
    apiKey: 'MY_API_KEY',
    clientId: 'MY_CLIENT_ID',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scope: 'https://www.googleapis.com/auth/drive.readonly'
  }).then(function () {
    return gapi.auth2.getAuthInstance().signIn();
  }).then(listFiles)
    .catch(function (error) {
      document.getElementById('most-popular').innerText = 'Sorry! Connection unsuccessful.';
      console.error('Error:', error);
    });
}


function listFiles() {
  gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': 'nextPageToken, files(id, name)',
    'driveId': SHARED_DRIVE_ID,
    'corpora': 'drive',
    'includeItemsFromAllDrives': true,
    'supportsAllDrives': true
  }).then(function (response) {
    var files = response.result.files;
    if (files && files.length > 0) {
      document.getElementById('most-popular').innerText = 'Eureka! Successful connection.';
    } else {
      document.getElementById('most-popular').innerText = 'Eureka! Successful connection, but no files found.';
    }
  }).catch(function (error) {
    document.getElementById('most-popular').innerText = 'Sorry! Connection unsuccessful.';
    console.error('Error:', error);
  });
}

<script async defer src="https://apis.google.com/js/api.js" onload="handleClientLoad()"></script>