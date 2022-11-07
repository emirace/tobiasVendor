import { Footer } from "./Footer.js";

export const resetSuccess = (resetUrl) => {
  return `<div style='width:100%;display:flex;justify-content:center'>
  <div style="max-width: 600px;">
  <div
  style="
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    /* max-width: 600px; */
  "
>
  <img
    style="cursor: pointer; height: 50px; margin: 15px"
    src="https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif"
    alt="logo"
  />
  <div style="margin: 15px; font-size: 20px; font-weight: bold">
    Your Password Is Successfully Reset
  </div>
  <div style="margin: 15px; width: 100%; font-weight: bold">Hi Example,</div>
  <div style="margin-bottom: 15px; width: 100%">
    You’ve successfully reset your RePeddle password.
  </div>
  <div style="margin-bottom: 15px; width: 100%">Thanks for using RePeddle!</div>
  <div style="margin-bottom: 15px; text-align: justify">
    If you did not initiate or make this change, or you believe an unauthorised
    person has accessed your account, please visit your profile without delay to
    reset your password and update your account.
  </div>
  <div style="margin-bottom: 15px 0; width: 100%; text-align: justify">
    You received this email because you’re registered on RePeddle with this
    email address <span style="color: #8a1719">example@repeddle.com</span> We
    respect your privacy, please visit our<a href="" style="color: #8a1719">
      privacy policy</a
    >
    to know how we use your data.
  </div>

  <div style="margin-top: 15px; width: 100%">Happy Peddling With Love</div>
  <div style="font-size: 20px; font-weight: bold; width: 100%">
    The Repeddle Team!
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
