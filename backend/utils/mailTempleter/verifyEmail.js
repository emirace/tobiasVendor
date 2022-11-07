import { Footer } from "./Footer.js";

export const verifyEmail = () => {
  return `<div style='width:100%;display:flex;justify-content:center'><div style="
  max-width: 600px;">
  <div
  style="
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
  "
>
  <img
    style="cursor: pointer; height: 50px; margin: 15px"
    src="https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif"
    alt="logo"
  />
  <div style="margin: 15px; font-size: 20px; font-weight: bold">
    Let’s Get Your Email Verified While You Peddle!
  </div>
  <div style="margin: 15px; font-size: 20px; font-weight: bold; width: 100%">
    Hi User
  </div>
  <div style="margin: 15px 0">
    Please kindly verify your Email address before you start listing your
    product and having access to the full functionality that gives you secured
    RePeddle user experience.
  </div>
  <div style="margin-bottom: 15px">
    Here is your registered email address example@gmail.com Your email
    verification code is: 123456
  </div>
  <div style="margin-top: 15px; width: 100%">Happy Peddling With Love</div>
  <div style="font-size: 20px; font-weight: bold; width: 100%">
    The Repeddle Team!
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
