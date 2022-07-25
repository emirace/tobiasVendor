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
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
`;
const Title = styled.h3``;

export default function Chart({ title, data, dataKey, grid }) {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container mode={mode}>
      {console.log(data)}
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" aspect={5 / 1}>
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
