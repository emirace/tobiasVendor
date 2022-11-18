import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError, getMonday, region } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Chart from "./Chart";
import FeatureInfo from "./FeatureInfo";
import FeatureInfo2 from "./FeatureInfo2";
import WidgetLarge from "./WidgetLarge";
import WidgetSmall from "./WidgetSmall";
import WidgetSmallProduct from "./WidgetSmallProduct";
import moment from "moment";

const today = moment().startOf("day");

const Container = styled.div`
  flex: 4;
`;
const Widgets = styled.div`
  display: flex;
  gap: 20px;
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
    align-items: start;
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
  margin: 20px 20px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Filter = styled.div`
  display: none;
  padding: 0 20px;
  justify-content: end;
  align-items: center;
`;
const Date = styled.div`
  margin: 5px 0 5px 10px;
`;
const DateInput = styled.input`
  background: none;
  width: 100px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  padding: 5px 0 5px 5px;
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
  cursor: pointer;
  border: 1px solid var(--malon-color);
  &:hover {
    background-color: var(--malon-color);
    color: white;
  }
`;

const DateLabel = styled.label`
  & svg {
    font-size: 18px;
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
    &:hover {
      color: var(--malon-color);
    }
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
  const { userInfo, mode, currency } = state;
  var now = new window.Date();
  const [from, setFrom] = useState("2022-04-24");
  const [to, setTo] = useState(now);
  const [value, setValue] = useState([null, null]);

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
        dispatch({ type: "ORDER_FAIL", payload: getError(err) });

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
        console.log(data);
        dispatch({ type: "PRODUCT_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "ORDER_FAIL", payload: getError(err) });
        console.log(getError(err));
      }
    };
    fetchData();
  }, [userInfo]);

  const [orderData, setOrderData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  useEffect(() => {
    const fetchOrderChart = () => {
      if (orders) {
        console.log(orders);
        let totalOrder = 0;
        let totalSale = 0;
        const orderData1 = orders.dailyOrders.map((x) => {
          totalOrder = totalOrder + Number(x.orders);
          totalSale = totalSale + Number(x.sales);
          return {
            name: `${x._id}`,
            order: x.orders,
            earning: x.sales,
            totalOrder,
            totalSale,
          };
        });
        setTotalOrders(totalOrder);
        setTotalSales(totalSale);
        setOrderData(orderData1);
        console.log("cht", orderData);
      }
    };
    fetchOrderChart();
  }, [orders]);

  useEffect(() => {
    const fetchProductChart = () => {
      if (orders) {
        let totalSale = 0;
        const productData1 = orders.dailyProducts.map((x) => {
          totalSale = totalSale + Number(x.products);
          return { name: `${x._id}`, products: x.products };
        });
        setProductData(productData1);
        setTotalProducts(totalSale);
      }
    };
    fetchProductChart();
  }, [orders]);

  useEffect(() => {
    const fetchPurchaseChart = () => {
      if (orders) {
        let totalSale = 0;
        const purchaseData = orders.dailyPurchase.map((x) => {
          totalSale = totalSale + Number(x.orders);
          return { name: `${x._id}`, order: x.orders };
        });
        setPurchaseData(purchaseData);
        setTotalPurchase(totalSale);
      }
    };
    fetchPurchaseChart();
  }, [orders]);
  var firstDay = new window.Date(now.getFullYear(), now.getMonth(), 1);

  return (
    <Container>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <WidgetsCont mode={mode}>
            <h3>Today</h3>
            {console.log("orders", orders)}
            <Widgets>
              <FeatureInfo2
                type="earning"
                number={
                  orders && orders.todayOrders.length
                    ? orders.todayOrders[0].sales
                    : 0
                }
              />
              {console.log("order", orders)}
              <FeatureInfo2
                type="order"
                number={
                  orders && orders.todayOrders.length
                    ? orders.todayOrders[0].orders
                    : 0
                }
              />
              {console.log(userInfo)}
              <FeatureInfo2
                type="product"
                number={
                  orders && orders.todayProducts.length
                    ? orders.todayProducts[0].numProducts
                    : 0
                }
              />
              <FeatureInfo2
                type="purchase"
                number={
                  orders && orders.todayPurchases.length
                    ? orders.todayPurchases[0].orders
                    : 0
                }
              />
            </Widgets>
          </WidgetsCont>

          <Filter>
            <Goto
              onClick={() => {
                setFrom(today.toDate());
                setTo(moment(today).endOf("day").toDate());
              }}
            >
              Today
            </Goto>
            <Goto
              onClick={() => {
                setFrom(getMonday(today));
                setTo(moment(today).endOf("day").toDate());
              }}
            >
              This Week
            </Goto>
            {console.log("firstday", firstDay)}
            <Goto
              onClick={() => {
                setFrom(firstDay);
                setTo(moment(today).endOf("day").toDate());
              }}
            >
              This Month
            </Goto>
            <Date>
              From:
              <DateInput
                id="fromdate"
                onChange={(e) => setFrom(e.target.value)}
                mode={mode}
                type="date"
                value={moment(from).format("YYYY-MM-DD").toString()}
              />
            </Date>
            <Date>
              To:{" "}
              <DateInput
                onChange={(e) => setTo(e.target.value)}
                mode={mode}
                type="date"
                value={moment(to).format("YYYY-MM-DD").toString()}
              />
            </Date>
          </Filter>
          <Row>
            <Col>
              <Chart
                title="Earning"
                total={`${currency}${totalSales.toFixed(2)}`}
                data={orderData}
                dataKey="earning"
                grid
              />
              <Chart
                title="Sold Orders"
                total={totalOrders}
                data={orderData}
                dataKey="order"
                grid
              />
            </Col>
            <Col>
              <Chart
                title="Product"
                total={totalProducts}
                data={productData}
                dataKey="products"
                grid
              />
              <Chart
                title="Purchase Order"
                data={purchaseData}
                dataKey="order"
                total={totalPurchase}
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
