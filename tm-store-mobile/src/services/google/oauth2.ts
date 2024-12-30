// const callbackUrl = 'http://localhost:8000/connect/google-add#state=pass-through%20value&access_token=ya29.a0AcM612xHb2vKPT2RdrPtARfFybF1UsICZjWChnFYRA-fFgPOOpTrzLqnT---IVpKfB8h8liIqgshciYM0wxt_9sUVLNXNilCeh9VMID4Y7Brqv4p086SfvtAjDfHYAlvexGHr4GdCzvqKcmDLqHfssom0ocrKx5UuZL97FGeaCgYKAUESARMSFQHGX2Mi8bij0pYX5nX_i-ZIvhpMFQ0175&token_type=Bearer&expires_in=3599&scope=email%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/drive.metadata.readonly%20https://www.googleapis.com/auth/drive%20https://www.googleapis.com/auth/spreadsheets&authuser=0&prompt=consent'
// const callbackUrlCode = 'http://localhost:8000/connect/google-add?state=pass-through+value&code=4/0AVG7fiRpUqV15kXtfwx2stIpM-DAsiSziAXuhfpTALc-m2fOHfF0_D92vlmbU5bdl3skVQ&scope=email+profile+https://www.googleapis.com/auth/drive+https://www.googleapis.com/auth/drive.metadata.readonly+https://www.googleapis.com/auth/spreadsheets+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+openid+https://www.googleapis.com/auth/documents&authuser=0&prompt=none'
export const scopesData = {
  userinfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
  tokeninfo: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  driveFiles: 'https://www.googleapis.com/drive/v2/files',
}
export const scopes = [ //https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  // 'https://www.googleapis.com/auth/forms',
  // 'https://www.googleapis.com/auth/keep'
]
const OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
// Parameters to pass to OAuth 2.0 endpoint.
export const CLIENT_ID = '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com'
export let PARAMS = {
  'client_id': CLIENT_ID,
  'redirect_uri': 'http://localhost:8000/connect/google-add',
  'response_type': 'code',//'token',
  'access_type': 'offline',
  'scope': scopes.join(' '),
  'include_granted_scopes': 'true',
  'state': 'pass-through value',
  'prompt': 'consent'
}

export const getHash = () => {
  const hash = {} as any
  const params = window.location.hash.slice(1).split('&')
  for (const p of params) {
    const obj = p.split('=')
    if (obj.length > 1) hash[obj[0]] = obj[1]
  }
  return hash
}

export const GoogleOAuthSignIn = (params?) => {
  //https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
  //https://accounts.google.com/o/oauth2/revoke?token={token}
  // Google's OAuth 2.0 endpoint for requesting an access token
  let oauth2Endpoint = `${OAUTH2_URL}?`
  PARAMS = { ...PARAMS, ...params }
  for (const p in PARAMS) {
    oauth2Endpoint += `${p}=${PARAMS[p]}&`
  }
  // console.log(PARAMS)
  const newWindow = window.open(oauth2Endpoint, 'name', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=600,width=450')
  if (window.focus && newWindow) {
    newWindow.focus()
  }
}

export const GoogleOAuthCallback = async () => {
  if (window.location.hash) {
    // const hash = getHash()
    // console.log(hash)
    // window.close()
  } else {
    // const params = new Proxy(new URLSearchParams(window.location.search), {
    //   get: (searchParams, prop) => searchParams.get(prop),
    // })
    const urlParams = new URLSearchParams(window.location.search)
    // const myParam = urlParams.get('myParam')
    const params = Object.fromEntries(urlParams.entries())
    params.client_id = CLIENT_ID
    // params.redirect_uri = PARAMS.redirect_uri
    // console.log(params)
    return params
  }
}

export const GoogleTokenInfo = async (access_token: string) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const rs = await response.json()
    return rs
  } catch (error) {
    console.log(error)
  }
  //https://www.googleapis.com/oauth2/v3/userinfo?access_token=ya29.a0AeDClZDFvKgLMsVXXQCRIXgv1PjJeSy3OwxpvtDMy6kUmxxL--RTaTV6Vy2YLeSZicROloxO4yDE4fhNMKmapJFxoou4mwW-UwnOYI5-PYrqV9ql6u0xHOsuYWahTnIfzSuWcFvNQlMGdd2n1FOE8flAJNOew4iauquISt89mgaCgYKAesSARMSFQHGX2Mi5k063-ytKsiyp6MmWvmHBA0177
  //https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=ya29.a0AeDClZDFvKgLMsVXXQCRIXgv1PjJeSy3OwxpvtDMy6kUmxxL--RTaTV6Vy2YLeSZicROloxO4yDE4fhNMKmapJFxoou4mwW-UwnOYI5-PYrqV9ql6u0xHOsuYWahTnIfzSuWcFvNQlMGdd2n1FOE8flAJNOew4iauquISt89mgaCgYKAesSARMSFQHGX2Mi5k063-ytKsiyp6MmWvmHBA0177
}