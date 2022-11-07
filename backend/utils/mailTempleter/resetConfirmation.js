import { Footer } from "./Footer.js";

export const resetConfirmation = () => {
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
    CONFIRMATION FOR RESET PASSWORD REQUEST!
  </div>
  <div style="margin: 15px 0; width: 100%">
    We have sent you an email to reset your password. If the email address you
    entered is registered to a RePeddle account, you’ll receive a password reset
    link. Follow the link provided to reset your password.
  </div>
  <div style="margin-bottom: 15px">
    If you did not get an email, check your junk or spam folders, and if
    nothing, try again with an email address linked to your RePeddle account
    or<a href="" style="color: #eb9f40"> Resend email confirmation</a>
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
