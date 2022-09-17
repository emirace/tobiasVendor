import axios from "axios";
import { region } from "../utils";

const facebookAppId = "1192378101342003";
//const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

export default function initFacebookSdk() {
  return new Promise((resolve) => {
    // wait for facebook sdk to initialize before starting the react app
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: "v8.0",
      });

      // auto authenticate with the api if already logged in with facebook
      window.FB.getLoginStatus(({ authResponse }) => {
        if (authResponse) {
          console.log(authResponse.accessToken);
        } else {
          console.log("authResponse.accessToken");
          resolve();
        }
      });
    };

    // load facebook sdk script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
}

export async function login() {
  // login with facebook then authenticate with the API to get a JWT auth token
  window.FB.login(
    function (response) {
      console.log(response.authResponse);
      apiAuthenticate(response.authResponse.accessToken);
    },
    { scope: "public_profile,email", return_scopes: true }
  );

}

export async function apiAuthenticate(accessToken) {
  // authenticate with the api using a facebook access token,
  // on success the api returns an account object with a JWT auth token
  const response = await axios.post(`/api/users/${region()}/facebook`, {
    accessToken,
  });
  const account = response.data;
  console.log(account);
  //signin here
  return account;
}

export function logout() {
  // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
  window.FB.api("/me/permissions", "delete", null, () => window.FB.logout());
}
