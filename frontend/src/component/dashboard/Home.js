import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Chart from "./Chart";
import FeatureInfo from "./FeatureInfo";
import WidgetLarge from "./WidgetLarge";
import WidgetSmall from "./WidgetSmall";
import WidgetSmallProduct from "./WidgetSmallProduct";

const Container = styled.div`
    flex: 4;
`;
const Widgets = styled.div`
    display: flex;
    gap: 20px;
    margin: 0 20px;
    @media (max-width: 992px) {
        flex-wrap: wrap;
    }
`;

const HomeWidget = styled.div`
    display: flex;
    margin: 20px;
    @media (max-width: 992px) {
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
`;

const reducer = (state, action) => {
    switch (action.type) {
        case "USERS_REQUEST":
            return { ...state, loading: true };
        case "USERS_SUCCESS":
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case "USERS_FAIL":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default function Home() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, users, error }, dispatch] = useReducer(reducer, {
        loading: false,
        users: [],
        error: "",
    });
    const [products, setProduct] = useState();

    useEffect(() => {
        const fetchAllUsers = async () => {
            if (userInfo.isAdmin) {
                try {
                    dispatch({ type: "USERS_FETCH" });
                    const { data } = await axios.get("/api/orders/summary", {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    dispatch({ type: "USERS_SUCCESS", payload: data });
                } catch (err) {
                    dispatch({ type: "USERS_FAIL", payload: err });

                    console.log(getError(err));
                }
            } else {
                try {
                    dispatch({ type: "USERS_FETCH" });
                    const { data } = await axios.get(
                        `/api/orders/seller/${userInfo._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${userInfo.token}`,
                            },
                        }
                    );
                    dispatch({ type: "USERS_SUCCESS", payload: data });
                    console.log("data", data);
                } catch (err) {
                    dispatch({ type: "USERS_FAIL", payload: err });

                    console.log(getError(err));
                }
            }
        };

        fetchAllUsers();
    }, [userInfo]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/api/products/seller/${userInfo._id}?page=${1}`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                setProduct(data);
            } catch (err) {
                console.log(getError(err));
            }
        };
        fetchData();
    }, [userInfo]);
    console.log(products);

    const data = [
        {
            name: "Jan",
            uv: 4000,
        },
        {
            name: "Feb",
            uv: 3000,
        },
        {
            name: "March",
            uv: 2000,
        },
        {
            name: "April",
            uv: 2780,
        },
        {
            name: "June",
            uv: 1890,
        },
        {
            name: "July",
            uv: 2390,
        },
        {
            name: "August",
            uv: 3490,
        },
    ];
    console.log(users);
    return (
        <Container>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <Widgets>
                        {userInfo.isAdmin && users.orders ? (
                            <FeatureInfo
                                type="user"
                                number={users.users[0].numUsers}
                            />
                        ) : (
                            ""
                        )}
                        <FeatureInfo
                            type="order"
                            number={
                                users.orders && userInfo.isAdmin
                                    ? users.orders[0].numOrders
                                    : users.length
                            }
                        />
                        <FeatureInfo
                            type="product"
                            number={
                                users.orders && userInfo.isAdmin
                                    ? users.products[0].numProducts
                                    : products
                                    ? products.products.length
                                    : ""
                            }
                        />
                        <FeatureInfo
                            type="earning"
                            number={
                                users.orders && userInfo.isAdmin
                                    ? users.orders[0].numSales
                                    : "565"
                            }
                        />
                    </Widgets>
                    <Chart
                        title="Product Sales Analytics"
                        data={data}
                        dataKey="uv"
                        grid
                    />
                    <HomeWidget>
                        {userInfo.isAdmin ? (
                            <WidgetSmall />
                        ) : (
                            <WidgetSmallProduct
                                products={products && products.products}
                            />
                        )}

                        <WidgetLarge />
                    </HomeWidget>
                </>
            )}
        </Container>
    );
}
