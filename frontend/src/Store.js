import { createContext, useReducer } from "react";
import secureLocalStorage from "react-secure-storage";
import { Howl, Howler } from "howler";

export const Store = createContext();
const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo"))
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  mode: localStorage.getItem("mode")
    ? localStorage.getItem("mode")
    : "pagebodylight",
  useraddress: localStorage.getItem("useraddress")
    ? localStorage.getItem("useraddress")
    : null,
  cart: {
    cartItems: [],
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    refresher: true,
  },
  notification: {
    text: "",
    buttonText: "",
    showStatus: false,
    link: "",
  },
  toast: {
    message: "",
    state1: "",
    showStatus: false,
  },
  onlineUser: [],
  recentlyViewed: localStorage.getItem("recentlyViewed")
    ? JSON.parse(localStorage.getItem("recentlyViewed"))
    : [],
  notifications: [],
  currency:
    window.location.hostname === "www.repeddle.com" ||
    window.location.hostname === "repeddle.com"
      ? "N "
      : "R ",
  cookies: localStorage.getItem("cookies")
    ? localStorage.getItem("cookies")
    : false,
  redirectToken: "",
};
const playNotificationSound = () => {
  const sound = new Howl({
    src: ["/sound/notification-sound.mp3"], // Replace with the correct path
  });
  sound.play();
};
function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_CART":
      return { ...state, cart: { ...state.cart, cartItems: action.payload } };
    case "CART_ADD_ITEM":
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    case "USER_SIGNIN":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          paymentMethod: [],
        },
      };
    case "SAVE_USER_ADDRESS":
      return {
        ...state,
        useraddress: action.payload,
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case "CHANGE_MODE":
      return { ...state, mode: action.payload };
    case "SET_ONLINE":
      return { ...state, onlineUser: action.payload };
    case "SHOW_NOTIFICAATION":
      return {
        ...state,
        notification: {
          text: action.payload.text,
          buttonText: action.payload.buttonText,
          showStatus: action.payload.showStatus,
          link: action.payload.link,
        },
      };
    case "REMOVE_NOTIFICAATION":
      return {
        ...state,
        notification: {
          text: "",
          buttonText: "",
          link: "",
          showStatus: false,
        },
      };
    case "SHOW_TOAST":
      return {
        ...state,
        toast: {
          message: action.payload.message,
          state1: action.payload.state1,
          showStatus: action.payload.showStatus,
        },
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toast: {
          message: "",
          state1: "",
          showStatus: false,
        },
      };
    case "UPDATE_NOTIFICATIONS":
      const newNotifications = action.payload;
      if (
        state.notifications.length !== 0 &&
        newNotifications.length > state.notifications.length
      ) {
        playNotificationSound();
      }

      return { ...state, notifications: action.payload };
    case "REFRESHER":
      return {
        ...state,
        refresher: action.payload,
      };
    case "SET_COOKIES":
      localStorage.setItem("cookies", action.payload);
      return {
        ...state,
        cookies: action.payload,
      };
    case "SET_REDIRECT_TOKEN":
      return {
        ...state,
        redirectToken: action.payload,
      };
    default:
      return state;
  }
}
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
