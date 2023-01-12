import axios from "axios";
import { banks } from "./constant";

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

  if (status === "Processing") {
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

  if (status === "Dispatched") {
    return (
      <div
        style={{
          background: "#FFC000",
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

  if (status === "Dispatched") {
    return (
      <div
        style={{
          background: "#FFC000",
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
  if (status === "In Transit") {
    return (
      <div
        style={{
          background: "#FFC000",
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
  if (status === "Processing") {
    return (
      <div
        style={{
          background: "FFBF00",
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
    window.location.hostname === "www.repeddle.co.za" ||
    window.location.hostname === "repeddle.co.za"
      ? "ZAR"
      : "NGN";
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

export const checkDeliverySelectItem = (cart) => {
  var success = true;
  if (!cart.deliverySelect) {
    success = false;
  }
  return success;
};

// var items = [];
// const shippingFee = (item, amount) => {
//   console.log("shippingFee", amount);
//   const exist = items.find((i) => i.id === item._id);
//   items = exist
//     ? items.map((c) =>
//         c.id === item._id ? { ...c, amount: Number(amount) } : c
//       )
//     : [...items, { id: item._id, amount: Number(amount) }];
//   return Number(amount);
// };
export const calcPrice = async (cart, userInfo, currentCartItem) => {
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.actualPrice, 0)
  );
  // const ItemShippingFee = async (c) => {
  //   console.log("text", cart, c);
  //   if (cart.cartItems.length !== 0 && c) {
  //     const data = await rebundleIsActive(userInfo, c.seller._id, cart);
  //     const selectedCartItem = cart.cartItems.find((cc) => cc._id === c._id);
  //     console.log(data, selectedCartItem);
  //     console.log(
  //       "data",
  //       checkDeliverySelectItem(c),
  //       checkDeliverySelectItem(selectedCartItem),
  //       c
  //     );
  //     return data.countAllow > 0
  //       ? shippingFee(selectedCartItem, 0)
  //       : checkDeliverySelectItem(selectedCartItem)
  //       ? shippingFee(selectedCartItem, selectedCartItem.deliverySelect.cost)
  //       : 0;
  //   } else {
  //     return 0;
  //   }
  // };
  console.log(cart);
  cart.shippingPrice = cart.cartItems.reduce(
    (a, c) =>
      a +
      (checkDeliverySelectItem(c) ? Number(c.deliverySelect.total.cost) : 0),
    0
  );

  cart.taxPrice = round2(0);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  return cart;
};

export const GOOGLE_CLIENT_ID =
  "359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com";

export const deliveryNumber = (status) => {
  switch (status) {
    case "Processing":
      return 1;
    case "Dispatched":
      return 2;
    case "In Transit":
      return 3;
    case "Delivered":
      return 4;
    case "Received":
      return 5;
    case "Return Logged":
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
    case "Refunded":
      return 12;
    case "Payment to Seller Initiated":
      return 13;

    default:
      return 0;
  }
};

export const loginGig = async () => {
  const { data } = await axios.post(
    "https://thirdparty.gigl-go.com/api/thirdparty/login",
    {
      username: "IND1109425",
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

export const rebundleIsActive = async (
  userInfo,
  userId,
  cart,
  valid = false
) => {
  if (userInfo) {
    try {
      const { data } = await axios.get(
        `/api/rebundleSellers/checkbundle/${userId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (data.success) {
        console.log("hello", data, cart.cartItems);
        const selectedCount = !valid
          ? cart.cartItems.reduce(
              (a, c) =>
                a +
                (c.deliverySelect["delivery Option"] ===
                data.seller.deliveryMethod
                  ? 1 * c.quantity
                  : 0),
              0
            )
          : cart.cartItems.reduce(
              (a, c) => a + (c.deliverySelect ? 1 * c.quantity : 0),
              0
            );
        const count = data.seller.count - selectedCount;
        const countAllow = count > 0 ? count : 0;
        // const success = countAllow > 0 ? true : false;
        return { ...data, countAllow };
      } else {
        return { ...data, countAllow: 0 };
      }
    } catch (err) {
      console.log(err);
    }
  }
  return { success: false };
};

export const getCode = (name) => {
  const result = banks.Nigeria.find((bank) => {
    console.log(bank.name, name);
    if (bank.name === name) {
      return bank.code;
    }
  });
  console.log(result.code);
  console.log(name);
  return result.code;
};
