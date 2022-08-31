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
        }}
      >
        {status}
      </div>
    );
  }
}
export const baseURL = () => {
  const add = "https://repeddle.com:5000";
  console.log(window.location.hostname);
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
