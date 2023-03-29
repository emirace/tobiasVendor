import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { Store } from '../../Store';
import { getError, region } from '../../utils';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import Chart from './Chart';
import FeatureInfo from './FeatureInfo';
import WidgetLarge from './WidgetLarge';
import WidgetSmall from './WidgetSmall';

const Container = styled.div`
  flex: 4;
`;
const Widgets = styled.div`
  display: flex;
  gap: 20px;
  margin: 0 20px;
`;

const HomeWidget = styled.div`
  display: flex;
  margin: 20px;
`;

const Filter = styled.div`
  display: flex;
  justify-content: end;
`;
const Date = styled.div`
  margin: 5px 10px;
`;
const DateInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  border: 0;
  padding: 5px;
  border-radius: 0.2rem;
  color-scheme: ${(props) =>
    props.mode === 'pagebodydark' ? 'dark' : 'light'};
  &:focus-visible {
    outline: none;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'USERS_REQUEST':
      return { ...state, loading: true };
    case 'USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'USERS_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Home() {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const [date, setDate] = useState('');

  const [{ loading, users, error }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        dispatch({ type: 'USERS_FETCH' });
        const { data } = await axios.get(`/api/orders/${region()}/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USERS_SUCCESS', payload: data });
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchAllUsers();
  }, [userInfo]);

  const data = [
    {
      name: 'Jan',
      uv: 4000,
    },
    {
      name: 'Feb',
      uv: 3000,
    },
    {
      name: 'March',
      uv: 2000,
    },
    {
      name: 'April',
      uv: 2780,
    },
    {
      name: 'June',
      uv: 1890,
    },
    {
      name: 'July',
      uv: 2390,
    },
    {
      name: 'August',
      uv: 3490,
    },
  ];
  return (
    <Container>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Filter>
            <Date>
              From:{' '}
              <DateInput
                onChange={(e) => console.log(e.target.value)}
                mode={mode}
                type="date"
              />
            </Date>
            <Date>
              To:{' '}
              <DateInput
                onChange={(e) => console.log(e.target.value)}
                mode={mode}
                type="date"
              />
            </Date>
          </Filter>
          <Chart title="Users Analytics" data={data} dataKey="uv" grid />
          <Chart title="Products Analytics" data={data} dataKey="uv" grid />
        </>
      )}
    </Container>
  );
}
