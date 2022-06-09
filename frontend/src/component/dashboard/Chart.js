import React from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Container = styled.div`
  margin: 20px;
  padding: 20px;
  background: var(--dark-ev1);
  border-radius: 0.2rem;
`;
const Title = styled.h3``;

export default function Chart({ title, data, dataKey, grid }) {
  return (
    <Container>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="var(--orange-color)" />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="var(--orange-color)"
          />
          <Tooltip />
          {grid && <CartesianGrid stroke="var(--dark-ev2)" />}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}
