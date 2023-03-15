import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { Store } from '../Store';
import { getError, loginGig } from '../utils';

const Container = styled.div`
  padding: 20px;
`;
const OrderDetail = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  font-weight: bold;
`;
const Button = styled.div`
  background: var(--orange-color);
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 5px 7px;
  color: white;
  &:hover {
    background: var(--malon-color);
  }
`;

export default function GigScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId, item: itemId } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/orders/${orderId}`,
          userInfo
            ? {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            : {}
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(getError(err));
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const confirm = async () => {
    try {
      setIsLoading(true);
      console.log('hello1');

      order.orderItems.map(async (item) => {
        if (item._id !== itemId) return;
        const loginData = await loginGig();

        console.log('loginData');

        const { data } = await axios.post(
          'https://thirdparty.gigl-go.com/api/thirdparty/captureshipment',
          {
            ReceiverAddress: item.deliverySelect.address,
            CustomerCode: loginData.username,
            SenderLocality: item.meta.address,
            SenderAddress: item.meta.address,
            ReceiverPhoneNumber: item.deliverySelect.phone,
            VehicleType: 'BIKE',
            SenderPhoneNumber: item.meta.phone,
            SenderName: item.meta.name,
            ReceiverName: item.deliverySelect.name,
            UserId: loginData.userId,
            ReceiverStationId: item.deliverySelect.stationId,
            SenderStationId: item.meta.stationId,
            ReceiverLocation: {
              Latitude: item.deliverySelect.lat,
              Longitude: item.deliverySelect.lng,
            },
            SenderLocation: {
              Latitude: item.meta.lat,
              Longitude: item.meta.lng,
            },
            PreShipmentItems: [
              {
                SpecialPackageId: '0',
                Quantity: item.quantity,
                Weight: 1,
                ItemType: 'Normal',
                ItemName: item.name,
                Value: item.actualPrice,
                ShipmentType: 'Regular',
                Description: item.description,
                ImageUrl: item.image,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${loginData.token}`,
            },
          }
        );
        console.log({ status: data.Code, message: data.ShortDescription });
        if (data.Code !== '200') {
          const error = { status: data.Code, message: data.ShortDescription };

          ctxDispatch({
            type: 'SHOW_TOAST',
            payload: {
              message: getError(error),
              showStatus: true,
              state1: 'visible1 error',
            },
          });
          throw error;
        }
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Order waybill sent',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
      });
      setIsLoading(false);
    } catch (err) {
      console.log(getError(err));
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: getError(err),
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      setIsLoading(false);
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <Container>
      <OrderDetail>
        <div style={{ marginRight: '20px' }}>Order Id</div>
        <div>{order._id}</div>
      </OrderDetail>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button onClick={confirm}>Confirm Delivery Order</Button>
        </div>
      )}
    </Container>
  );
}
