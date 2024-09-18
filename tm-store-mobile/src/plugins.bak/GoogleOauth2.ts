// import { reactive, readonly } from "vue";
// let GoogleOauth2;
// GoogleOauth2 = reactive({
//   tokenClient: null,
//   isInit: false,
//   isAuthorized: false,
// })
const googleAuth = (function () {
  function installClient() {
    const apiUrl = 'https://accounts.google.com/gsi/client';
    return new Promise((resolve) => {
      let script = document.createElement('script');
      script.src = apiUrl;
      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          setTimeout(function () {
            resolve()
          }, 500)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(script);
    })
  }

  function handleCallbackGSI(res) {
    console.log(`Encode JWT ID Token: ${res.credential}`)
    // const userObject = jwtDecode(res.credential)
    // console.log(userObject)
  }

  function initClient(config) {
    return new Promise((resolve, reject) => {
      // console.log('gisLoaded')
      google.accounts.id.initialize({
        client_id: config.clientId,
        callback: handleCallbackGSI, // defined later
      });
      // google.accounts.id.renderButton(
      //   document.getElementById(config.signInDIV),
      //   { theme: 'outline', size: 'large' }
      // );

      // Access Tokens
      // Token client
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: config.scope,
        callback: '' // defined later
      });
      // google.accounts.id.prompt();
      // gisInited = true;
      resolve({ google: window.google, tokenClient: tokenClient })

      // console.log(tokenClient)
      // maybeEnableButtons();
      // window.gapi.load('auth2', () => {
      //   window.gapi.auth2.init(config)
      //     .then(() => {
      //       resolve(window.gapi);
      //     }).catch((error) => {
      //       reject(error);
      //     })
      // })
    })

  }

  function Auth() {
    if (!(this instanceof Auth))
      return new Auth();
    this.load = (config) => {
      return installClient().then(() => {
        return initClient(config)
      }).then(({ google, tokenClient }) => {
        this.tokenClient = tokenClient
        this.google = google
        // console.log(google.accounts.oauth2)
        // console.log(tokenClient)
        // this.instance = gapi.auth2.getAuthInstance();
        this.prompt = config.prompt;
        // GoogleOauth2.instance = gapi.auth2.getAuthInstance();
        this.isInit = true;
        // GoogleOauth2.isAuthorized = this.instance.isSignedIn.get();
      }).catch((error) => {
        console.error(error);
      })
      // installClient()
      //   .then(() => {
      //     return initClient(config)
      //   })
      //   .then((gapi) => {
      //     this.instance = gapi.auth2.getAuthInstance();

      //     this.prompt = config.prompt;
      //     GoogleOauth2.instance = gapi.auth2.getAuthInstance();
      //     GoogleOauth2.isInit = true;
      //     GoogleOauth2.isAuthorized = this.instance.isSignedIn.get();
      //   }).catch((error) => {
      //     console.error(error);
      //   })
    };

    this.signIn = () => {
      return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          // document.getElementById('signout_button').style.visibility = 'visible';
          // document.getElementById('authorize_button').innerText = 'Refresh';
        };
        resolve(resp)
        // if (gapi.client.getToken() === null) {
        //   // Prompt the user to select a Google Account and ask for consent to share their data
        //   // when establishing a new session.
        //   tokenClient.requestAccessToken({ prompt: 'consent' });
        // } else {
        //   // Skip display of account chooser and consent dialog for an existing session.
        //   tokenClient.requestAccessToken({ prompt: '' });
        // }
      })
    };

    this.getAuthCode = () => {
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          reject(false)
          return
        }
        this.instance.grantOfflineAccess({ prompt: this.prompt })
          .then(function (resp) {
            resolve(resp.code)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    };

    this.signOut = () => {
      return new Promise((resolve, reject) => {
        // const token = gapi.client.getToken();
        // if (token !== null) {
        this.google.accounts.oauth2.revoke(token.access_token);
        // gapi.client.setToken('');
        // document.getElementById('content').innerText = '';
        // document.getElementById('authorize_button').innerText = 'Authorize';
        // document.getElementById('signout_button').style.visibility = 'hidden';
        // }
      })
    };
  }

  return new Auth()
})();

export default {
  install: (app, options) => {
    /* eslint-disable */
    //set config
    let config = { scope: 'profile email', prompt: 'select_account' };
    if (typeof options === 'object') {
      config = Object.assign(config, options);
      if (!options.clientId) {
        throw new Error('clientId is require');
      }
    } else {
      throw new TypeError('invalid option type. Object type accepted only');
    }

    //Install Vue plugin
    googleAuth.load(config)
    app.config.globalProperties.$GoogleOauth2 = googleAuth;
    app.provide('$GoogleOauth2', googleAuth);
  }
}