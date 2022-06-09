import React from 'react';
import styled from 'styled-components';
import Home from '../component/dashboard/Home';
import Sidebar from '../component/dashboard/Sidebar';

const Container = styled.div`
  display: flex;
  margin-top: 10px;
`;

export default function DashboardNewScreen() {
  return (
    <Container>
      <Sidebar />
      <Home />
    </Container>
  );
}
