import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Chart from "./Chart";
import FeatureInfo from "./FeatureInfo";
import FeatureInfo2 from "./FeatureInfo2";
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
const WidgetsCont = styled.div`
  margin: 0 20px;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Row = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  margin: 0 20px;
`;
const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Filter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;
const Date = styled.div`
  margin: 5px 10px;
`;
const DateInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  padding: 5px;
  border-radius: 0.2rem;
  color-scheme: ${(props) =>
    props.mode === "pagebodydark" ? "dark" : "light"};
  &:focus-visible {
    outline: none;
  }
`;

const Goto = styled.div`
  font-weight: 500;
  padding: 1px 8px;
  border: 1px solid var(--malon-color);
  &:hover {
    background-color: var(--malon-color);
    color: white;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "ORDER_REQUEST":
      return { ...state, loading: true };
    case "ORDER_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "PRODUCT_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case "ORDER_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Home() {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  var now = new window.Date();
  const [from, setFrom] = useState("2022-04-24");
  const [to, setTo] = useState(now);
  console.log(now);

  const [{ loading, orders, error, products }, dispatch] = useReducer(reducer, {
    loading: false,
    orders: null,
    error: "",
  });

  useEffect(() => {
    const fetchAl = async () => {
      try {
        dispatch({ type: "ORDER_FETCH" });
        const { data } = await axios.get(
          `/api/orders/summary/user?to=${to}&from=${from}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: "ORDER_SUCCESS", payload: data });
        console.log("data", data);
      } catch (err) {
        dispatch({ type: "ORDER_FAIL", payload: err });

        console.log(getError(err));
      }
    };

    fetchAl();
  }, [userInfo, to, from]);

  useEffect(() => {
    dispatch({ type: "ORDER_FETCH" });
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/seller/${userInfo._id}?page=${1}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PRODUCT_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "ORDER_FAIL", payload: err });
        console.log(getError(err));
      }
    };
    fetchData();
  }, [userInfo]);

  const [orderData, setOrderData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    const fetchOrderChart = () => {
      if (orders) {
        console.log(orders);
        const orderData1 = orders.dailyOrders.map((x) => {
          return { name: `${x._id}`, order: x.orders, earning: x.sales };
        });
        setOrderData(orderData1);
        console.log("cht", orderData);
      }
    };
    fetchOrderChart();
  }, [orders]);

  useEffect(() => {
    const fetchProductChart = () => {
      if (orders) {
        console.log(orders);
        const productData1 = orders.dailyProducts.map((x) => {
          return { name: `${x._id}`, products: x.products };
        });
        setProductData(productData1);
      }
    };
    fetchProductChart();
  }, [orders]);

  useEffect(() => {
    const fetchPurchaseChart = () => {
      if (orders) {
        const purchaseData = orders.dailyPurchase.map((x) => {
          return { name: `${x._id}`, order: x.orders };
        });
        setPurchaseData(purchaseData);
      }
    };
    fetchPurchaseChart();
  }, [orders]);

  return (
    <Container>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <WidgetsCont mode={mode}>
            <h3 style={{ marginLeft: "40px" }}>Today</h3>
            <Widgets>
              <FeatureInfo2
                type="earning"
                number={
                  orders && orders.orders.length ? orders.orders[0].numSales : 0
                }
              />
              {console.log("order", orders)}
              <FeatureInfo2
                type="order"
                number={
                  orders && orders.orders.length
                    ? orders.orders[0].numOrders
                    : 0
                }
              />
              <FeatureInfo2
                type="product"
                number={orders && orders.products[0].numProducts}
              />
              <FeatureInfo2
                type="purchase"
                number={orders && orders.purchases[0].numOrders}
              />
            </Widgets>
          </WidgetsCont>

          <Filter>
            <Goto>Today</Goto>
            <Date>
              From:{" "}
              <DateInput
                onChange={(e) => setFrom(e.target.value)}
                mode={mode}
                type="date"
                value={from}
              />
            </Date>
            <Date>
              To:{" "}
              <DateInput
                onChange={(e) => setTo(e.target.value)}
                mode={mode}
                type="date"
                value={to}
              />
              {console.log(from)}
            </Date>
          </Filter>
          <Row>
            <Col>
              <Chart title="Earning" data={orderData} dataKey="earning" grid />
              <Chart
                title="Orders"
                yaxis="name"
                data={orderData}
                dataKey="order"
                grid
              />
            </Col>
            <Col>
              <Chart
                title="Product"
                data={productData}
                dataKey="products"
                grid
              />
              <Chart
                title="Purchase"
                data={purchaseData}
                dataKey="order"
                grid
              />
            </Col>
          </Row>
          <HomeWidget>
            <WidgetSmallProduct products={products && products.products} />

            <WidgetLarge />
          </HomeWidget>
        </>
      )}
    </Container>
  );
}
