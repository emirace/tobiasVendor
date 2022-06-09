import React from 'react';
import styled from 'styled-components';
import Chart from './Chart';
import FeatureInfo from './FeatureInfo';
import WidgetLarge from './WidgetLarge';
import WidgetSmall from './WidgetSmall';

const Container = styled.div`
  flex: 4;
`;

const HomeWidget = styled.div`
  display: flex;
  margin: 20px;
`;

export default function Home() {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <Container>
      <FeatureInfo />
      <Chart title="Users Analytics" data={data} dataKey="uv" grid />
      <HomeWidget>
        <WidgetSmall />
        <WidgetLarge />
      </HomeWidget>
    </Container>
  );
}
