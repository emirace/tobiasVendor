import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
`;
const BoxCont = styled.div`
  position: relative;
`;
const Box = styled.div`
  width: 30px;
  height: 30px;
  transform: rotate(45deg);
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    transform: rotate(-45deg);
  }
  &.active {
    background: green;
  }
`;
const Text = styled.div`
  position: absolute;
  left: 50%;
  top: 35px;
  transform: translateX(-50%);
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 1em;
`;
const Line = styled.div`
  width: 45px;
  height: 5px;
  background: grey;
  &.active {
    background: green;
  }
`;
export default function ({ status }) {
  return (
    <Container>
      <Content>
        {status < 6 ? (
          <>
            <BoxCont>
              <Box className={status >= 1 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Not yet Dispatched</Text>
            </BoxCont>
            <Line className={status >= 1 ? "active" : ""} />
            <Line className={status >= 2 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 2 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Dispatch</Text>
            </BoxCont>
            <Line className={status >= 2 ? "active" : ""} />
            <Line className={status >= 3 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 3 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>In Transit</Text>
            </BoxCont>
            <Line className={status >= 3 ? "active" : ""} />
            <Line className={status >= 4 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 4 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Delivered</Text>
            </BoxCont>
            <Line className={status >= 4 ? "active" : ""} />
            <Line className={status >= 5 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 5 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Received</Text>
            </BoxCont>
          </>
        ) : (
          <>
            {/* <Line className={status >= 5 ? "active" : ""} /> */}
            <Line className={status >= 6 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 6 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Returned</Text>
            </BoxCont>

            <Line className={status >= 6 ? "active" : ""} />
            <Line className={status >= 7 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 7 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Return Approved</Text>
            </BoxCont>
            <Line className={status >= 7 ? "active" : ""} />
            <Line className={status >= 8 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 8 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Return Declined</Text>
            </BoxCont>

            <Line className={status >= 8 ? "active" : ""} />
            <Line className={status >= 9 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 9 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Return Dispatched</Text>
            </BoxCont>
            <Line className={status >= 9 ? "active" : ""} />
            <Line className={status >= 10 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 10 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Return Delivered</Text>
            </BoxCont>
            <Line className={status >= 10 ? "active" : ""} />
            <Line className={status >= 11 ? "active" : ""} />
            <BoxCont>
              <Box className={status >= 11 ? "active" : ""}>
                <FontAwesomeIcon color="white" icon={faCheck} />
              </Box>
              <Text>Return Received</Text>
            </BoxCont>
          </>
        )}
      </Content>
    </Container>
  );
}
