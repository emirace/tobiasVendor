import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
    width: 100%;
    margin: 0 10px;
`;

const Tab = styled.div`
    display: flex;
`;
const TabItem = styled.div`
    padding: 10px;
`;
const Content = styled.div`
    display: flex;
`;
const Left = styled.div`
    flex: 3;
`;
const Center = styled.div`
    flex: 5;
    padding: 5px;
`;
const Right = styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    & svg {
        color: var(--orange-color);
    }
`;
const OrderImg = styled.img.attrs({
    src: "/images/pimage.png",
    alt: "imag",
})`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const Name = styled.div`
    width: 180px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: capitalize;
`;
const OrderNum = styled.div`
    font-size: 13px;
`;
const Status = styled.button`
    background: green;
    color: #fff;
    font-size: 13px;
    padding: 2px 5px;
    border: 0;
    cursor: none;
`;
const Date = styled.div``;

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, orders: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function OrderHistoryScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const { data } = await axios.get(`/api/orders/mine`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (error) {
                dispatch({
                    type: "FETCH_FAIL",
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [userInfo]);
    return (
        <div>
            <Helmet>
                <title>Order History</title>
            </Helmet>
            <h1>Order History</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <Container>
                        <Tab>
                            <TabItem>Active Orders</TabItem>
                            <TabItem>Active Orders</TabItem>
                        </Tab>
                        <Content>
                            <Left>
                                <OrderImg></OrderImg>
                            </Left>
                            <Center>
                                <Name>this is the dress of all hshevfwgge</Name>
                                <OrderNum>Order 123456789098765543</OrderNum>
                                <Status>Delivered</Status>
                                <Date>22-02-22</Date>
                            </Center>
                            <Right>
                                <FontAwesomeIcon icon={faPen} />
                            </Right>
                        </Content>
                    </Container>
                    {/*<table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.itemsPrice.toFixed(2)}</td>
                                    <td>
                                        {order.isPaid
                                            ? order.paidAt.substring(0, 10)
                                            : "No"}
                                    </td>
                                    <td>
                                        {order.isDelivered
                                            ? order.deliveredAt.substring(0, 10)
                                            : "No"}
                                    </td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => {
                                                navigate(`/order/${order._id}`);
                                            }}
                                        >
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>*/}
                </>
            )}
        </div>
    );
}
