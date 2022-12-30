import axios from "axios";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { logout } from "../hooks/initFacebookSdk";
import { Store } from "../Store";
import { region } from "../utils";

const Container = styled.div`
  background: var(--orange-color);
  color: white;
  border-radius: 0.2rem;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: var(--malon-color);
  }
`;
export default function RedirectButton() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const signoutHandler = () => {
    logout();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };
  const redirect = async () => {
    try {
      const { data } = await axios.get("api/redirects", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (data.success) {
        if (region() === "ZAR") {
          signoutHandler();
          window.location.replace(
            `https://repeddle.com?redirecttoken=${data.token}`
            // `http://localhost:3000?redirecttoken=${data.token}&url=com`
          );
        } else {
          signoutHandler();
          window.location.replace(
            `https://repeddle.co.za?redirecttoken=${data.token}`
            // `http://localhost:3000?redirecttoken=${data.token}&url=coza`
          );
        }
      }
    } catch (err) {}
  };
  return userInfo?.isAdmin ? (
    <Container onClick={redirect}>Redirect</Container>
  ) : (
    ""
  );
}
