import React, { useContext } from "react";
import { Store } from "../Store";

const AlertComponent = ({ onCancel, onWishlist, onConfirm, message }) => {
  const { state } = useContext(Store);
  const { mode } = state;

  const alertStyle = {
    padding: 30,
    alignItems: "center",
  };

  const messageStyle = {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    marginTop: 25,
  };

  const buttonsContainerStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "end",
  };

  const buttonStyle = {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    cursor: "pointer",
  };

  const cancelButtonStyle = {
    position: "absolute",
    top: 10,
    right: 10,
  };

  const confirmButtonStyle = {
    color: "var(--orange-color)",
    fontSize: 18,
  };

  const wishlistButtonStyle = {
    color: "var(--malon-color)",
    fontSize: 18,
  };

  return (
    <div style={alertStyle}>
      <p style={messageStyle}>{message}</p>
      <div style={buttonsContainerStyle}>
        <div style={buttonStyle} onClick={onWishlist}>
          <span style={wishlistButtonStyle}>Add to wishlist</span>
        </div>
        <div style={buttonStyle} onClick={onConfirm}>
          <span style={confirmButtonStyle}>Confirm</span>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
