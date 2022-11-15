import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError, region } from "../../../utils";
import moment from "moment";
import LoadingBox from "../../LoadingBox";
import WidgetSmall from "../WidgetSmall";
import FeatureInfo from "../FeatureInfo";
const Container = styled.div`
  flex: 4;
  min-width: 0;
  padding: 0 20px;
`;
const Content = styled.div`
  min-width: 0;
  flex: 1;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    width: 100%;
    margin-right: 0;
  }
`;
const Tittle = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const List = styled.ul``;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;
const Img = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const Flex1 = styled.div`
  flex: 1;
`;
const User = styled.div`
  display: flex;

  flex-direction: column;
`;
const Username = styled.span`
  font-weight: 600;
`;
const Role = styled.span`
  font-weight: 300;
`;
const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
  & svg {
    font-size: 16px;
    margin-right: 5px;
  }
`;
const ItemRow = styled.div`
  display: flex;
  scroll-behavior: smooth;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: inline mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ItemCont = styled.div`
  position: relative;
  width: 180px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const ItemImage = styled.img`
  width: 180px;
  border-radius: 0.2rem;
  height: 180px;
  object-fit: cover;
`;
const Sold = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black -color)"
      : "var(--white-color)"};
  opacity: 0.5;
  width: 180px;
  height: 180px;
  border-radius: 0%;
  position: absolute;
  top: 0;
  left: 0;
`;
const Text = styled.div`
  font-size: 20px;
  color: var(--orange-color);
  font-weight: bold;
`;
const Count = styled.div`
  margin: 0 2px;
`;
const ItemName = styled.div`
  font-weight: bold;
  text-transform: capitalize;
  margin: 5px;
  white-space: nowrap;
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const View = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.2rem;
  padding: 3px 8px;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
  & svg {
    font-size: 16px;
    margin-right: 5px;
  }
`;
const Edit = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.2rem;
  padding: 3px 8px;
  background: var(--malon-color);
  color: var(--white-color);
  cursor: pointer;
  & svg {
    font-size: 16px;
    margin-right: 5px;
  }
`;
const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 170px;
  margin: 5px;
`;
const NameCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Widgets = styled.div`
  display: flex;
  gap: 20px;
  margin: 0 20px 20px 0;
  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
`;
export default function Analytics() {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const [users, setUsers] = useState();
  const [users2, setUsers2] = useState();
  const [products, setProducts] = useState();
  const [product, setProduct] = useState();
  const [soldProducts, setSoldProducts] = useState();
  const [mostView, setMostView] = useState();
  const [error, setError] = useState();
  const [bestseller, setBestseller] = useState();

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${region()}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUsers(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    fetchAllUser();
  }, [userInfo]);

  useEffect(() => {
    const fetchMostView = async () => {
      try {
        const { data } = await axios.get(`/api/recentviews/${region()}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setMostView(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    fetchMostView();
  }, []);
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await axios.get(`/api/bestsellers/${region()}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setBestseller(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    fetchBestSellers();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(`/api/admins/${region()}/products`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProducts(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    fetchAllProducts();
  }, [userInfo]);

  useEffect(() => {
    const OutOfStock = async () => {
      try {
        const { data } = await axios.get(
          `/api/admins/${region()}/soldproducts`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setSoldProducts(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    OutOfStock();
  }, [userInfo]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (userInfo.isAdmin) {
        try {
          const { data } = await axios.get(`/api/orders/${region()}/summary`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setUsers2(data);
        } catch (err) {
          console.log(getError(err));
        }
      } else {
        try {
          const { data } = await axios.get(
            `/api/orders/seller/${userInfo._id}`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          setUsers2(data);
          console.log("data", data);
        } catch (err) {
          setError(getError(err));
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
  return (
    <Container>
      {error ? (
        error
      ) : !users2 ? (
        <LoadingBox />
      ) : (
        <Widgets>
          {userInfo.isAdmin && users2.orders ? (
            <FeatureInfo type="user" number={users2.users[0].numUsers} />
          ) : (
            ""
          )}
          <FeatureInfo
            type="order"
            number={
              users2.orders.length > 0 && userInfo.isAdmin
                ? users2.orders[0].numOrders
                : users2.length
            }
          />
          <FeatureInfo
            type="product"
            number={
              users2.orders.length > 0 && userInfo.isAdmin
                ? users2.products[0].numProducts
                : products
                ? products.products.length
                : ""
            }
          />
          <FeatureInfo
            type="earning"
            number={
              users2.orders.length > 0 && userInfo.isAdmin
                ? users2.orders[0].numSales
                : "565"
            }
          />
        </Widgets>
      )}
      <Content mode={mode}>
        <NameCont>
          <Tittle>New Joined Members</Tittle>
          <Link to="/dashboard/userlist">See All</Link>
        </NameCont>
        {!users ? (
          <LoadingBox />
        ) : (
          <ItemRow>
            {users.map((user) => (
              <ItemCont mode={mode}>
                <ItemImage src={user.image} alt="item" />

                <ItemName>{user.name}</ItemName>
                <Count>
                  {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </Count>

                <Actions>
                  <Link to={`/seller/${user._id}`}>
                    <View>
                      <FontAwesomeIcon icon={faEye} /> View
                    </View>
                  </Link>
                  <Link to={`/dashboard/user/${user._id}`}>
                    <Edit>
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Edit>
                  </Link>
                </Actions>
              </ItemCont>
            ))}
          </ItemRow>
        )}
      </Content>
      <Content mode={mode}>
        <NameCont>
          <Tittle>Top Sellers</Tittle>
          <Link to="/admin/topsellers">See All</Link>
        </NameCont>
        {!bestseller ? (
          <LoadingBox />
        ) : (
          <ItemRow>
            {console.log(bestseller)}
            {bestseller.map((user) => (
              <ItemCont mode={mode}>
                <ItemImage src={user.userId.image} alt="item" />

                <ItemName>{user.userId.name}</ItemName>
                <Count>
                  {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </Count>
                <Count>{user.userId.sold.length} sold</Count>

                <Actions>
                  <Link to={`/seller/${user.userId._id}`}>
                    <View>
                      <FontAwesomeIcon icon={faEye} /> View
                    </View>
                  </Link>
                  <Link to={`/dashboard/user/${user.userId._id}`}>
                    <Edit>
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Edit>
                  </Link>
                </Actions>
              </ItemCont>
            ))}
          </ItemRow>
        )}
      </Content>
      <Content mode={mode}>
        <NameCont>
          <Tittle>Recently Added Products</Tittle>
          <Link to="/admin/allProductList/">See All</Link>
        </NameCont>
        {error ? (
          error
        ) : !products ? (
          <LoadingBox />
        ) : (
          <ItemRow>
            {products.map((product) => (
              <ItemCont mode={mode}>
                <ItemImage src={product.image} alt="item" />

                <ItemName>{product.name}</ItemName>
                <Count>
                  {moment(product.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </Count>
                <Actions>
                  <Link to={`/product/${product.slug}`}>
                    <View>
                      <FontAwesomeIcon icon={faEye} /> View
                    </View>
                  </Link>
                  <Link to={`/dashboard/product/${product._id}`}>
                    <Edit>
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Edit>
                  </Link>
                </Actions>
              </ItemCont>
            ))}
          </ItemRow>
        )}
      </Content>

      <Content mode={mode}>
        <NameCont>
          <Tittle>Out Of Stock Products</Tittle>
          <Link to="/admin/outofstock">See All</Link>
        </NameCont>
        {error ? (
          error
        ) : !soldProducts ? (
          <LoadingBox />
        ) : (
          <ItemRow>
            {soldProducts.map((product) => (
              <ItemCont mode={mode}>
                <ItemImage src={product.image} alt="item" />
                <Sold mode={mode}>
                  <Text>SOLD</Text>
                </Sold>

                <ItemName>{product.name}</ItemName>
                <Count>
                  {moment(product.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </Count>
                <Actions>
                  <Link to={`/product/${product.slug}`}>
                    <View>
                      <FontAwesomeIcon icon={faEye} /> View
                    </View>
                  </Link>
                  <Link to={`/dashboard/product/${product._id}`}>
                    <Edit>
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Edit>
                  </Link>
                </Actions>
              </ItemCont>
            ))}
          </ItemRow>
        )}
      </Content>

      <Content mode={mode}>
        <NameCont>
          <Tittle>Most Viewed Products</Tittle>
          <Link to="/dashboard/productlist">See All</Link>
        </NameCont>
        {error ? (
          error
        ) : !mostView ? (
          <LoadingBox />
        ) : (
          <ItemRow>
            {console.log("mostView", mostView)}
            {mostView.map((product) => (
              <ItemCont mode={mode}>
                <ItemImage src={product.productId.image} alt="item" />

                <ItemName>{product.productId.name}</ItemName>
                <Count>{product.numViews} Views</Count>
                <Actions>
                  <Link to={`/product/${product.productId.slug}`}>
                    <View>
                      <FontAwesomeIcon icon={faEye} /> View
                    </View>
                  </Link>
                  <Link to={`/dashboard/product/${product._id}`}>
                    <Edit>
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Edit>
                  </Link>
                </Actions>
              </ItemCont>
            ))}
          </ItemRow>
        )}
      </Content>
    </Container>
  );
}

// <Content mode={mode}>
//   <Tittle>Products Out of Stock</Tittle>
//   <List>
//     {users &&
//       users.map((u) => (
//         <ListItem>
//           <Flex1>
//             <Img src={u.image} alt="profile" />
//           </Flex1>
//           <Flex1>
//             <User>
//               <Username>{u.name}</Username>
//               <Role>{u.isAdmin ? "Admin" : "User"}</Role>
//             </User>
//           </Flex1>
//           <Flex1>22 Views</Flex1>
//           <Flex1>
//             <Link to={`/dashboard/user/${u._id}`}>
//               <Button>
//                 <FontAwesomeIcon icon={faEye} /> View
//               </Button>
//             </Link>
//           </Flex1>
//         </ListItem>
//       ))}
//   </List>
// </Content>
