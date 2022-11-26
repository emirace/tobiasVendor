import axios from "axios";
import React, { useContext } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";

const Container = styled.div`
  flex: 4;
  margin: 0 20px;
  margin-bottom: -25px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
    margin-bottom: 10px;
  }
`;

const CouponCont = styled.div`
  border: 1px solid var(--malon-color);
  height: 40px;
  display: flex;
  border-radius: 0.2rem;
`;
const Input = styled.input`
  flex: 4;
  border-top-left-radius: 0.2rem;
  border-bottom-left-radius: 0.2rem;
  border: 0;
  padding: 5px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-1)" : "var(--light-ev1)"};
  &:focus-visible {
    outline: none;
  }
`;
const Apply = styled.button`
  flex: 1;
  color: var(--white-color);
  background: var(--orange-color);
  border: 0;
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
  @media (max-width: 992px) {
    flex: 2;
  }
`;
export default function Coupon() {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const createCoupon = async () => {
    try {
      const { data } = await axios.post(
        "/api/coupons",
        {
          type: "fixed",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
    } catch (err) {
      console.log(getError(err));
    }
  };
  return (
    <Container mode={mode}>
      <CouponCont>
        <Input mode={mode} placeholder="Enter value" />
        <Apply onClick={""}>Generate</Apply>
      </CouponCont>
    </Container>
  );
}
