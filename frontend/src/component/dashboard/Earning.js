import React, { useContext, useState } from "react";
import styled from "styled-components";
import FeatureInfo from "./FeatureInfo";
import WidgetLarge from "./WidgetLarge";
import moment from "moment";
import { Store } from "../../Store";
import { getMonday } from "../../utils";

const today = moment().startOf("day");

const Container = styled.div`
  flex: 4;
  min-width: 0;
  padding: 0 20px;
`;

const Row = styled.div`
  display: flex;
`;

const Filter = styled.div`
  display: flex;
  padding: 0 20px;
  justify-content: end;
  align-items: center;
`;
const Date = styled.div`
  margin: 5px 0 5px 10px;
`;
const DateInput = styled.input`
  background: none;
  width: 100px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  padding: 5px 0 5px 5px;
  border-radius: 0.2rem;
  color-scheme: ${(props) =>
    props.mode === "pagebodydark" ? "dark" : "light"};
  &:focus-visible {
    outline: none;
  }
`;

const Goto = styled.div`
  font-weight: 500;
  padding: 1px 8px;
  cursor: pointer;
  border: 1px solid var(--malon-color);
  &:hover {
    background-color: var(--malon-color);
    color: white;
  }
`;

export default function Earning() {
  const { state } = useContext(Store);
  const { mode } = state;
  var now = new window.Date();
  const [from, setFrom] = useState("2022-04-24");
  const [to, setTo] = useState(now);

  var firstDay = new window.Date(now.getFullYear(), now.getMonth(), 1);
  return (
    <Container>
      <Row>
        <FeatureInfo type="today" number={"565"} />
        <FeatureInfo type="earning" number={"565"} />
      </Row>

      <Filter>
        <Goto
          onClick={() => {
            setFrom(today.toDate());
            setTo(moment(today).endOf("day").toDate());
          }}
        >
          Today
        </Goto>
        <Goto
          onClick={() => {
            setFrom(getMonday(today));
            setTo(moment(today).endOf("day").toDate());
          }}
        >
          This Week
        </Goto>
        {console.log("firstday", firstDay)}
        <Goto
          onClick={() => {
            setFrom(firstDay);
            setTo(moment(today).endOf("day").toDate());
          }}
        >
          This Month
        </Goto>
        <Date>
          From:
          <DateInput
            id="fromdate"
            onChange={(e) => setFrom(e.target.value)}
            mode={mode}
            type="date"
            value={moment(from).format("YYYY-MM-DD").toString()}
          />
        </Date>
        <Date>
          To:{" "}
          <DateInput
            onChange={(e) => setTo(e.target.value)}
            mode={mode}
            type="date"
            value={moment(to).format("YYYY-MM-DD").toString()}
          />
        </Date>
      </Filter>
      <WidgetLarge />
    </Container>
  );
}
