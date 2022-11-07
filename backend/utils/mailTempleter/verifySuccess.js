import { Footer } from "./Footer.js";

export const verifySuccess = () => {
  return `<div style='width:100%;display:flex;justify-content:center'>
  <div style="
  max-width: 600px;">
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
    Your Email Is Successfully Verified
  </div>
  <div style="margin: 15px; font-size: 20px; font-weight: bold; width: 100%">
    Hi User
  </div>
  <div style="margin: 15px 0; width: 100%">
    Thank you for verifying your email and connecting with us.
  </div>
  <div style="margin-bottom: 15px">
    As you now join the community of RePeddle tribe, we’re committed to ensure
    you have the very best experience using RePeddle platforms and tools.
  </div>
  <div style="margin-bottom: 15px">
    Please visit our support centre or FAQ should you need any assistance. Our
    support teams are also more than happy to help! Email support@repeddle.com
  </div>
  <div style="margin-top: 15px; width: 100%">Happy Peddling With Love</div>
  <div style="font-size: 20px; font-weight: bold; width: 100%">
    The Repeddle Team!
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
