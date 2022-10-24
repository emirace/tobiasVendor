import React, { useContext } from "react";
import styled from "styled-components";
import { RiCustomerService2Fill } from "react-icons/ri";
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
  & svg {
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
  right: 20px;
  width: 350px;
  border-radius: 0.2rem;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
`;
const Top = styled.div`
  flex: 1;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodylight" ? "black" : "white"};
  color: ${(props) => (props.mode === "pagebodylight" ? "white" : "black")};
`;
const Logo = styled.div``;
const Name = styled.div``;
const Bottom = styled.div`
  flex: 4;
`;
const SmallBox = styled.div`
  background: white;
`;
const BoxCont = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;
const Head = styled.div``;
const Li = styled.div``;
const Button = styled.div``;

export default function Support() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  return (
    <Container mode={mode}>
      <RiCustomerService2Fill />
      <FontAwesomeIcon icon={faArrowDown} />
      <Box>
        <Top mode={mode}>
          <Logo />
          <Name>Hello {userInfo?.username ?? "Guest"}</Name>
        </Top>
        <Bottom />
        <BoxCont>
          <SmallBox>
            <Head>FAQ</Head>
            <div>
              <Li>
                <span>How can i start sell </span>{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </Li>
              <Li>
                <span>How can i start sell </span>{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </Li>
              <Li>
                <span>How can i start sell </span>{" "}
                <FontAwesomeIcon icon={faArrowRight} />
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
        </BoxCont>
      </Box>
    </Container>
  );
}
