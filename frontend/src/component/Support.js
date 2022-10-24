import React, { useContext } from "react";
import styled from "styled-components";
import { RiCustomerService2Fill } from "react-icons/ri";
import { CgChevronRight } from "react-icons/cg";
import { Store } from "../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 9;
  border-radius: 50%;
  background: ${(props) =>
    props.mode === "pagebodylight" ? "black" : "white"};
  display: flex;
  justify-content: center;
  align-items: center;
  & svg.bigicon {
    font-size: 30px;

    color: ${(props) =>
      props.mode === "pagebodylight"
        ? "var(--orange-color)"
        : "var(--orange-color)"};
  }
`;
const Box = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  border-radius: 0.2rem;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
`;
const Top = styled.div`
  flex: 2;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodylight" ? "black" : "white"};
  color: ${(props) => (props.mode === "pagebodylight" ? "white" : "black")};
`;
const Logo = styled.img``;
const Name = styled.div`
  font-size: 25px;
  text-transform: capitalize;
  margin-left: 30px;
  font-weight: bold;
`;
const Bottom = styled.div`
  flex: 5;
`;
const SmallBox = styled.div`
  padding: 15px;
  border-radius: 0.2rem;
  border-top: 1px solid var(--orange-color);
  background: white;
  margin-bottom: 20px;
  box-shadow: 0 0 25px rgba(24, 24, 24, 0.4);
`;
const BoxCont = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: auto;
  height: 100%;
`;
const Head = styled.div`
  font-weight: bold;
`;
const Li = styled.div`
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
const Button = styled.div``;

export default function Support() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  return (
    <Container mode={mode}>
      <RiCustomerService2Fill className="bigicon" />
      <FontAwesomeIcon icon={faArrowDown} />
      <Box>
        <Top mode={mode}>
          <Logo />
          <Name>Hello {userInfo?.username ?? "Guest"}</Name>
        </Top>
        <Bottom />
        <BoxCont>
          <div style={{ padding: "100px 10px 10px 10px" }}>
            <SmallBox>
              <Head>FAQ</Head>
              <div>
                <Li>
                  <span>How can i start sell </span> <CgChevronRight />
                </Li>
                <Li>
                  <span>How can i start sell </span> <CgChevronRight />
                </Li>
                <Li>
                  <span>How can i start sell </span> <CgChevronRight />
                </Li>
                <Li>
                  <span>How can i start sell </span> <CgChevronRight />
                </Li>
              </div>
            </SmallBox>
            <SmallBox>
              <Head>Start a conversation</Head>
              <div>We will replay as soon as we can</div>
              <Button>
                <FontAwesomeIcon icon={faPaperPlane} /> Send us a message
              </Button>
            </SmallBox>
          </div>
        </BoxCont>
      </Box>
    </Container>
  );
}
