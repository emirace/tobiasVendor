import axios from "axios";

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const couponDiscount = (coupon, price) => {
  if (coupon.type === "fixed") {
    return coupon.value;
  } else if (coupon.type === "percent") {
    return (coupon.percentOff / 100) * price;
  } else {
    return 0;
  }
};

export function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function timeDifference(date1, date2) {
  console.log(date1, date2);
  var Difference_In_Time = date2.getTime() - date1.getTime();
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Math.floor(Difference_In_Days);
}

export function displayDeliveryStatus(status) {
  if (status === "Delivered") {
    return (
      <div
        style={{
          background: "var(--green-color)",
          textTransform: "uppercase",
          borderRadius: "0.25rem",
          color: "white",
          textAlign: "center",
          padding: "2px 10px",
        }}
      >
        {status}
      </div>
    );
  }
  if (status === "reject") {
    return (
      <div
        style={{
          background: "var(--yellow-color)",
          textTransform: "uppercase",
          borderRadius: "0.25rem",
          color: "white",
          textAlign: "center",
          padding: "2px 10px",
        }}
      >
        {status}
      </div>
    );
  }

  if (status === "Not yet Dispatched") {
    return (
      <div
        style={{
          background: "blue",
          textTransform: "uppercase",
          borderRadius: "0.25rem",
          color: "white",
          textAlign: "center",
          padding: "2px 10px",
        }}
      >
        {status}
      </div>
    );
  }

  if (status === "Hold") {
    return (
      <div
        style={{
          background: "var(--yellow-color)",
          textTransform: "uppercase",
          borderRadius: "0.25rem",
          color: "black",
          textAlign: "center",
          padding: "2px 10px",
        }}
      >
        {status}
      </div>
    );
  } else {
    return (
      <div
        style={{
          background: "grey",
          textTransform: "uppercase",
          borderRadius: "0.25rem",
          color: "white",
          textAlign: "center",
          padding: "2px 10px",
        }}
      >
        {status}
      </div>
    );
  }
}
export const region = () => {
  const add =
    window.location.hostname === "www.repeddle.com" ||
    window.location.hostname === "repeddle.com"
      ? "NGN"
      : "ZAR";
  console.log(window.location.hostname, "region", add);
  return add;
};

export const checkDeliverySelect = (cart) => {
  var success = true;
  cart.cartItems.map((x) => {
    if (!x.deliverySelect) {
      success = false;
    }
  });
  return success;
};

export const calcPrice = (cart) => {
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.actualPrice, 0)
  );
  cart.shippingPrice = checkDeliverySelect(cart)
    ? round2(
        cart.cartItems.reduce((a, c) => a + Number(c.deliverySelect.cost), 0)
      )
    : 0;
  cart.taxPrice = round2(0);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
};
export const GOOGLE_CLIENT_ID =
  "359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com";

export const deliveryNumber = (status) => {
  switch (status) {
    case "Not yet Dispatched":
      return 1;
    case "Dispatched":
      return 2;
    case "In transit":
      return 3;
    case "Delivered":
      return 4;
    case "Received":
      return 5;
    case "Returned":
      return 6;
    case "Return Approved":
      return 8;
    case "Return Declined":
      return 7;
    case "Return Dispatched":
      return 9;
    case "Return Delivered":
      return 10;
    case "Return Received":
      return 11;

    default:
      return 0;
  }
};

export const loginGig = async () => {
  const { data } = await axios.post(
    "https://giglthirdpartyapitestenv.azurewebsites.net/api/thirdparty/login",
    {
      username: "ACC001052",
      Password: "1234567",
      SessionObj: "",
    }
  );
  return {
    token: data.Object.access_token,
    username: data.Object.UserName,
    userId: data.Object.UserId,
  };
};
