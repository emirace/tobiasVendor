import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError, region } from "../../utils";

const Container = styled.div`
  flex: 1;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 20px;
  margin-right: 20px;
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
  justify-content: space-between;
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

export default function WidgetSmall() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;

  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${region()}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUsers(data);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchAllUser();
  }, [userInfo]);

  return (
    <Container mode={mode}>
      <Tittle>New Join Members</Tittle>
      <List>
        {users &&
          users.map((u) => (
            <ListItem>
              <Img src={u.image} alt="profile" />
              <User>
                <Username>{u.name}</Username>
                <Role>{u.isAdmin ? "Admin" : "User"}</Role>
              </User>
              <Link to={`/dashboard/user/${u._id}`}>
                <Button>
                  <FontAwesomeIcon icon={faEye} /> View
                </Button>
              </Link>
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
