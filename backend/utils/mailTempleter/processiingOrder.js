import { Footer } from "./Footer.js";

export const processiingOrder = (resetUrl) => {
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
    Your Order (order number…..) Is Being Processed
  </div>
  <div style="margin: 15px; width: 100%; font-weight: bold">Hi Example,</div>
  <div style="margin-bottom: 15px; width: 100%">
    Thanks for shopping with us! @example is getting your order ready for you.
  </div>
  <div style="margin-bottom: 15px; text-align: justify">
    You can track the process of your order from the product details<a
      href=""
      style="color: #8a1719"
    >
      TRACK ORDER</a
    >
    on your dashboard, or through the notification centre of your profile.
  </div>
  <div style="margin-bottom: 15px 0; width: 100%; text-align: justify">
    Shopping with RePeddle helps extend the life cycle of fabrics, give your
    pre-loved item a new home, minimize fashion footprint and promotes a better
    planet for all.
  </div>
  <div style="margin: 15px; width: 100%; color: #999999">PLEASE NOTE:</div>
  <ul style="margin-bottom: 15px; margin-top: 0; width: 100%">
    <li>
      Orders can't be cancelled once placed. If you would like to make any
      adjustment on your order, Please contact the seller via the message system
      available on the App and Website.
    </li>
    <li>
      The delivery address can't be changed once the order has been placed, as
      the information has already been sent to the chosen delivery for
      processing.
    </li>
  </ul>
  <div style="margin-top: 15px; width: 100%; text-align: right">
    You can download your
    <b style="color: #8a1719"
      >Invoice <a style="color: black" href=""> here</a></b
    >
  </div>
  <div style="margin-top: 15px; width: 100%">Happy Peddling With Love</div>
  <div style="font-size: 20px; font-weight: bold; width: 100%">
    The Repeddle Team!
  </div>
  <div
    style="font-size: 16px; font-weight: bold; margin-top: 20px; width: 100%"
  >
    Here Are Your Order Details:
  </div>
</div>
  ${Footer()}
  </div></div>`;
};
