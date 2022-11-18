import React, { useContext } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Store } from "../../Store";

const Container = styled.div`
  padding: 20px;
  height: 300px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    height: 200px;
  }
`;
const Title = styled.h3``;
const Row = styled.div`
  display: flex;
  align-items: center;
`;
const Total = styled.div`
  margin-left: 15px;
  font-size: 18px;
`;

export default function Chart({ title, total, data, dataKey, grid }) {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container mode={mode}>
      {console.log(data)}
      <Row>
        <Title>{title}</Title>
        <Total>{total}</Total>
      </Row>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey={"name"} stroke="var(--orange-color)" />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="var(--orange-color)"
          />
          <Tooltip />
          {grid && (
            <CartesianGrid
              stroke={
                mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"
              }
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}
