import axios from "axios";
import { banks } from "./constant";
import { socket } from "./App";
import { Link } from "react-router-dom";
import MessageImage from "./component/MessageImage";

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
  const deliveryStatusMap = {
    Processing: 1,
    Dispatched: 2,
    "In Transit": 3,
    Delivered: 4,
    Received: 5,
    "Return Logged": 6,
    "Return Approved": 8,
    "Return Declined": 7,
    "Return Dispatched": 9,
    "Return Delivered": 10,
    "Return Received": 11,
    Refunded: 12,
    "Payment to Seller Initiated": 13,
  };

  return deliveryStatusMap[status] || 0;
};

export const loginGig = async () => {
  const { data } = await axios.post(
    "https://thirdparty.gigl-go.com/api/thirdparty/login",
    {
      username: "IND1109425",
      Password: "RBUVBi9EZs_7t_q@6019",
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
  if (!userInfo) {
    return { success: false };
  }

  try {
    const { data } = await axios.get(
      `/api/rebundleSellers/checkbundle/${userId}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    const countAllow = calculateCountAllow(data, cart, valid);
    return { ...data, countAllow };
  } catch (err) {
    console.log(err);
  }
};

const calculateCountAllow = (data, cart, valid) => {
  if (!data.success) {
    return 0;
  }

  console.log("hello", data, cart.cartItems);
  const selectedCount = cart.cartItems.reduce((a, c) => {
    if (!valid) {
      return (
        a +
        (c.deliverySelect["delivery Option"] === data.seller.deliveryMethod
          ? 1 * c.quantity
          : 0)
      );
    } else {
      return a + (c.deliverySelect ? 1 * c.quantity : 0);
    }
  }, 0);

  const count = data.seller.count - selectedCount;
  const countAllow = count > 0 ? count : 0;
  return countAllow;
};

// export const rebundleIsActive = async (
//   userInfo,
//   userId,
//   cart,
//   valid = false
// ) => {
//   if (userInfo) {
//     try {
//       const { data } = await axios.get(
//         `/api/rebundleSellers/checkbundle/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );

//       if (data.success) {
//         console.log("hello", data, cart.cartItems);
//         const selectedCount = !valid
//           ? cart.cartItems.reduce(
//               (a, c) =>
//                 a +
//                 (c.deliverySelect["delivery Option"] ===
//                 data.seller.deliveryMethod
//                   ? 1 * c.quantity
//                   : 0),
//               0
//             )
//           : cart.cartItems.reduce(
//               (a, c) => a + (c.deliverySelect ? 1 * c.quantity : 0),
//               0
//             );
//         const count = data.seller.count - selectedCount;
//         const countAllow = count > 0 ? count : 0;
//         // const success = countAllow > 0 ? true : false;
//         return { ...data, countAllow };
//       } else {
//         return { ...data, countAllow: 0 };
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   return { success: false };
// };

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

export const compressImageUpload = async (file, maxSize, token, image = "") => {
  // Create an HTMLImageElement to get the original dimensions of the image
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve();
    };
    img.onerror = reject;
  });
  const { width, height } = img;

  // Resize the image if necessary
  if (width > maxSize || height > maxSize) {
    const aspectRatio = width / height;
    let newWidth, newHeight;
    if (aspectRatio >= 1) {
      newWidth = maxSize;
      newHeight = maxSize / aspectRatio;
    } else {
      newHeight = maxSize;
      newWidth = maxSize * aspectRatio;
    }
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const resizedBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob !== null) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        },
        file.type,
        0.9
      );
    });

    file = new File([resizedBlob], file.name, { type: file.type });
  }

  // Upload the resized image using axios
  const formData = new FormData();
  formData.append("file", file);
  image && formData.append("deleteImage", image);
  try {
    const response = await axios.post("/api/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    return data.secure_url;
  } catch (error) {
    // Handle error if the request fails
    console.error("Error uploading image:", error);
    throw error;
  }
};

export function createHtmlFromObjects(objectArray) {
  return objectArray ? (
    objectArray.map((item, index) => {
      if (item.type === "div") {
        return (
          <div style={{ marginBottom: "10px" }} key={index}>
            {item.content}
          </div>
        );
      } else if (item.type === "img") {
        return <MessageImage key={index} url={item.content} />;
      } else if (item.type === "link") {
        return <Link to={item.href}>{item.content}</Link>;
      } else {
        // Handle other types or provide a default case
        return null;
      }
    })
  ) : (
    <div>___ No message data ___</div>
  );
}
