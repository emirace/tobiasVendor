import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { Store } from "../Store";
import { getError, loginGig } from "../utils";

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
const Button2 = styled.div`
  background: var(--malon-color);
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
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState("");
  const [itemId, setitemId] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/gigs/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data.orderId);
        setStatus(data.status);
        setitemId(data.productId);
        setLoading(false);
      } catch (err) {
        setError(getError(err));
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  // const confirm = async () => {
  //   try {
  //     console.log("hello1");
  //     setIsLoading(true);
  //     order.orderItems.map(async (item) => {
  //       if (item._id !== itemId) return;

  //       const loginData = await loginGig();

  //       console.log("loginData");

  //       const { data } = await axios.post(
  //         "https://thirdparty.gigl-go.com/api/thirdparty/captureshipment",
  //         {
  //           ReceiverAddress: item.deliverySelect.address,
  //           CustomerCode: loginData.username,
  //           SenderLocality: item.meta.address,
  //           SenderAddress: item.meta.address,
  //           ReceiverPhoneNumber: item.deliverySelect.phone,
  //           VehicleType: "BIKE",
  //           SenderPhoneNumber: item.meta.phone,
  //           SenderName: item.meta.name,
  //           ReceiverName: item.deliverySelect.name,
  //           UserId: loginData.userId,
  //           ReceiverStationId: item.deliverySelect.stationId,
  //           SenderStationId: item.meta.stationId,
  //           ReceiverLocation: {
  //             Latitude: item.deliverySelect.lat,
  //             Longitude: item.deliverySelect.lng,
  //           },
  //           SenderLocation: {
  //             Latitude: item.meta.lat,
  //             Longitude: item.meta.lng,
  //           },
  //           PreShipmentItems: [
  //             {
  //               SpecialPackageId: "0",
  //               Quantity: item.quantity,
  //               Weight: 1,
  //               ItemType: "Normal",
  //               ItemName: item.name,
  //               Value: item.actualPrice,
  //               ShipmentType: "Regular",
  //               Description: item.description,
  //               ImageUrl: item.image,
  //             },
  //           ],
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${loginData.token}`,
  //           },
  //         }
  //       );

  //       console.log({ status: data.Code, message: data.ShortDescription });
  //       if (data.Code !== "200") {
  //         const error = { status: data.Code, message: data.ShortDescription };

  //         ctxDispatch({
  //           type: "SHOW_TOAST",
  //           payload: {
  //             message: getError(error),
  //             showStatus: true,
  //             state1: "visible1 error",
  //           },
  //         });
  //         throw error;
  //       }

  //       await axios.put(
  //         `/api/gigs/${id}`,
  //         { status: true },
  //         {
  //           headers: {
  //             authorization: `Bearer ${userInfo.token}`,
  //           },
  //         }
  //       );
  //       setStatus(true);
  //       console.log("i am here");
  //       ctxDispatch({
  //         type: "SHOW_TOAST",
  //         payload: {
  //           message: "Order waybill sent",
  //           showStatus: true,
  //           state1: "visible1 success",
  //         },
  //       });
  //       setIsLoading(false);
  //     });
  //   } catch (err) {
  //     console.log(getError(err));
  //     ctxDispatch({
  //       type: "SHOW_TOAST",
  //       payload: {
  //         message: getError(err),
  //         showStatus: true,
  //         state1: "visible1 error",
  //       },
  //     });
  //     setIsLoading(false);
  //   }
  // };

  const confirm = async () => {
    try {
      console.log("hello1");
      setIsLoading(true);

      const promises = order.orderItems.map(async (item) => {
        if (item._id !== itemId) return;

        const loginData = await loginGig();

        console.log("loginData");

        const response = await axios.post(
          "https://thirdparty.gigl-go.com/api/thirdparty/captureshipment",
          {
            ReceiverAddress: item.deliverySelect.address,
            CustomerCode: loginData.username,
            SenderLocality: item.meta.address,
            SenderAddress: item.meta.address,
            ReceiverPhoneNumber: item.deliverySelect.phone,
            VehicleType: "BIKE",
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
                SpecialPackageId: "0",
                Quantity: item.quantity,
                Weight: 1,
                ItemType: "Normal",
                ItemName: item.name,
                Value: item.actualPrice,
                ShipmentType: "Regular",
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

        console.log({
          status: response.data.Code,
          message: response.data.ShortDescription,
        });

        if (response.data.Code !== "200") {
          const error = {
            status: response.data.Code,
            message: response.data.ShortDescription,
          };
          throw error;
        }

        await axios.put(
          `/api/gigs/${id}`,
          { status: true },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        console.log("i am here");
        return item;
      });

      await Promise.all(promises);

      setStatus(true);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Order waybill sent",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      console.log(getError(err));
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    } finally {
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
        <div style={{ marginRight: "20px" }}>Order Id</div>
        <div>{order._id}</div>
      </OrderDetail>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <LoadingBox />
        ) : !status ? (
          <Button onClick={confirm}>Confirm Pending Delivery</Button>
        ) : (
          <Button2>Gig Delivery Confirmed</Button2>
        )}
      </div>
    </Container>
  );
}
