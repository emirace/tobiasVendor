import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Store } from '../../Store';
import { getError } from '../../utils';
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
  const { userInfo } = state;

  const [{ loading, users, error }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        dispatch({ type: 'USERS_FETCH' });
        const { data } = await axios.get('/api/orders/summary', {
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
          <Widgets>
            {console.log(users)}
            <FeatureInfo type="user" number={users.users[0].numUsers} />
            <FeatureInfo type="order" number={users.orders[0].numOrders} />
            <FeatureInfo
              type="product"
              number={users.products[0].numProducts}
            />
            <FeatureInfo type="earning" number={users.orders[0].numSales} />
          </Widgets>
          <Chart title="Users Analytics" data={data} dataKey="uv" grid />
          <HomeWidget>
            <WidgetSmall />
            <WidgetLarge />
          </HomeWidget>
        </>
      )}
    </Container>
  );
}
