import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import moment from "moment";
import LoadingBox from "../../LoadingBox";
import WidgetSmall from "../WidgetSmall";
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
  margin: 0 5px;
`;
const ItemName = styled.div`
  font-weight: bold;
  text-transform: capitalize;
  margin: 5px;
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
  width: 100%;
  margin: 5px;
`;
const NameCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export default function Analytics() {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const [users, setUsers] = useState();
  const [products, setProducts] = useState();
  const [soldProducts, setSoldProducts] = useState();
  const [mostView, setMostView] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const { data } = await axios.get("/api/users", {
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
        const { data } = await axios.get("/api/recentviews", {
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
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get("/api/admins/products", {
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
        const { data } = await axios.get("/api/admins/soldproducts", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSoldProducts(data);
      } catch (err) {
        setError(getError(err));
        console.log(getError(err));
      }
    };
    OutOfStock();
  }, [userInfo]);
  return (
    <Container>
      <Content mode={mode}>
        <NameCont>
          <Tittle>New Join Members</Tittle>
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
          <Tittle>Recently Added Product</Tittle>
          <Link to="/dashboard/productlist">See All</Link>
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
          <Link to="/dashboard/productlist">See All</Link>
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
          <Tittle>Most Viewed Product</Tittle>
          <Link to="/dashboard/productlist">See All</Link>
        </NameCont>
        {error ? (
          error
        ) : !mostView ? (
          <LoadingBox />
        ) : (
          <ItemRow>
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
