import { Footer } from "./Footer.js";

export const passwordReset = (resetUrl, email) => {
  return `<div style='width:100%;display:flex;justify-content:center'>
  <div style="max-width: 600px;">
  <div
  style="
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
  "
>
  <img
    style="cursor: pointer; height: 50px; margin: 15px"
    src="https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif"
    alt="logo"
  />
  <div style="margin: 15px; font-size: 20px; font-weight: bold">
    Yay.!!! Let’s Get You Back To Your Account.
  </div>
  <div style="margin: 15px 0; width: 100%">
    Your linked email address is
    <span style="color: #eb9f40">${email}</span>
  </div>
  <div style="margin: 15px 0; width: 100%">
    You recently requested a password reset to get access back to your RePeddle
    account.
  </div>
  <div style="margin-bottom: 15px; text-align: justify">
    Resetting your password may unlink your account from all the signed in
    device, to get access back to your RePeddle account on all your devices,
    please ensure to log-in again to the devices you may have your RePeddle
    account after changing your password.
  </div>
  <div style="margin-bottom: 15px 0; width: 100%">
    Copy and paste the below link into your browser if you prefer not to be
    redirected.
  </div>
  <a href="${resetUrl}" style="margin: 15px 0; color: #eb9f40">
  ${resetUrl}
  </a>

  <div style="font-size: 18px; font-weight: bold; width: 100%">
    Please ignore and do not take any action if you did not request for a
    password reset.
  </div>
  <div style="margin-top: 15px; width: 100%">Happy Peddling With Love</div>
  <div style="font-size: 20px; font-weight: bold; width: 100%">
    The Repeddle Team!
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
