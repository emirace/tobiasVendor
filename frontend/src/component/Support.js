import React, { useContext, useState } from "react";
import styled from "styled-components";
import { RiCustomerService2Fill } from "react-icons/ri";
import { CgChevronRight } from "react-icons/cg";
import { CgChevronLeft } from "react-icons/cg";
import { CgChevronDown } from "react-icons/cg";
import { GrAttachment } from "react-icons/gr";
import { HiOutlineSearch } from "react-icons/hi";
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
  color: black;
  cursor: pointer;
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
  background: black;
  color: white;
`;
const Logo = styled.img`
  width: 40%;
  margin: 30px;
`;
const Name = styled.div`
  font-size: 30px;
  text-transform: capitalize;
  margin-left: 30px;
  font-weight: bold;
  color: var(--orange-color);
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
const Button = styled.div`
  border: 1px solid black;
  border-radius: 0.2rem;
  display: flex;
  padding: 5px 10px;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  & svg {
    margin-right: 10px;
  }
`;
const SearchCont = styled.div`
  border: 1px solid;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin: 10px 0;
`;
const Input = styled.input`
  border: 0;
  padding: 0 10px;
  flex: 1;
  &:focus-visible {
    outline: none;
  }
`;
const Admin = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
  & svg {
    font-size: 25px;
  }
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;
const InputCont = styled.div`
  display: flex;
  border-top: 1px solid;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  & svg {
    margin: 0 5px;
  }
`;
const ChatArea = styled.div`
  flex: 5;
`;
const ChatCont = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export default function Support() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [showSupport, setShowSupport] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);
  return (
    <Container mode={mode}>
      {!showSupport ? (
        <RiCustomerService2Fill
          className="bigicon"
          onClick={() => setShowSupport(true)}
        />
      ) : (
        <CgChevronDown
          className="bigicon"
          onClick={() => setShowSupport(false)}
        />
      )}
      {showSupport && (
        <Box>
          <Top mode={mode}>
            {!sendMessage ? (
              <>
                <Logo src="https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif" />
                <Name>Hello {userInfo?.username ?? "Guest"}</Name>
              </>
            ) : (
              <>
                <Admin>
                  <CgChevronLeft onClick={() => setSendMessage(false)} />
                  <Logo src="https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif" />
                </Admin>
                <Admin style={{ marginLeft: "70px" }}>
                  <Image src="/images/pimage.png" />
                  <div style={{ margin: "10px 0", maxWidth: "200px" }}>
                    We will replay as soon as we can
                  </div>
                </Admin>
              </>
            )}
          </Top>
          <Bottom>
            {sendMessage && (
              <ChatCont>
                <ChatArea></ChatArea>
                <InputCont>
                  <Input placeholder="Start typing..." />
                  <GrAttachment />
                  <FontAwesomeIcon icon={faPaperPlane} />
                </InputCont>
              </ChatCont>
            )}
          </Bottom>
          {!sendMessage && (
            <BoxCont>
              <div style={{ padding: "150px 10px 10px 10px" }}>
                <SmallBox>
                  <Head>FAQ</Head>
                  <SearchCont>
                    <HiOutlineSearch />
                    <Input placeholder="Search quession" />
                  </SearchCont>
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
                    <Li>
                      <span>How can i start sell </span> <CgChevronRight />
                    </Li>
                  </div>
                </SmallBox>
                <SmallBox>
                  <Head>Start a conversation</Head>

                  <Admin>
                    <Image src="/images/pimage.png" />
                    <div style={{ margin: "10px 0" }}>
                      We will replay as soon as we can
                    </div>
                  </Admin>
                  <Button onClick={() => setSendMessage(true)}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Send us a message
                  </Button>
                </SmallBox>
              </div>
            </BoxCont>
          )}
        </Box>
      )}
    </Container>
  );
}
