import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Store } from "../../Store";
import axios from "axios";
import { getError, region } from "../../utils";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LoadingBox from "../LoadingBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  max-width: 600px;
  // margin: 0 auto;
  padding: 20px;
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  font-size: 16px;
  @media (max-width: 992px) {
    display: block;
  }
`;

const ListItem1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  @media (max-width: 992px) {
    display: block;
  }
`;

const SubListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
`;

const Email = styled.span`
  flex: 1;
`;
const SelectAllLabel = styled.div``;

const Date = styled.span`
  color: #999;
`;

const Loading = styled.div`
  text-align: center;
`;

const Error = styled.div`
  color: red;
  text-align: center;
`;
const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  margin-bottom: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Title = styled.h1`
  padding: 20px 20px 0 20px;
`;
const Checkbox = styled.input`
  margin-bottom: 10px;
  margin-right: 10px;
  &::after {
    width: 15px;
    height: 15px;
    content: "";
    display: inline-block;
    visibility: visible;
    position: relative;
    top: -2px;
    left: -1px;
    background-color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
    border: 1px solid var(--orange-color);
  }
  &:checked::after {
    width: 15px;
    height: 15px;
    content: "";
    display: inline-block;
    visibility: visible;
    position: relative;
    top: -2px;
    left: -1px;
    background-color: var(--orange-color);
    border: 1px solid var(--orange-color);
  }
`;

const Button = styled.button`
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-left: auto;
  &:hover {
    background: var(--malon-color);
  }
`;
const TextInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
  border-radius: 0.2rem;
  height: 40px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  &.half {
    width: 100px;
    margin-right: 5px;
  }
  &:invalid {
    /* outline: 1px solid var(--red-color); */
  }
  @media (max-width: 992px) {
  }
`;

export default function NewsletterList() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [newsletters, setNewsletters] = useState([]);
  const [loadingNewsletters, setLoadingNewsletters] = useState(true);
  const [errorNewsletters, setErrorNewsletters] = useState("");

  const [rebatchs, setRebatchs] = useState([]);
  const [loadingRebatch, setLoadingRebatch] = useState(true);
  const [errorRebatch, setErrorRebatch] = useState("");

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [salesQurrey, setSalesQurrey] = useState("all");

  const [emailName, setEmailName] = useState("");
  const [emailLists, setEmailLists] = useState([]);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [inputEmail, setInputEmail] = useState("");

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoadingNewsletters(true);
        const { data } = await axios.get(
          `/api/newsletters/newsletter?q=${salesQurrey}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setNewsletters(data.newsletters);
        setEmailLists(data.emailLists);
        setLoadingNewsletters(false);
      } catch (err) {
        setLoadingNewsletters(false);
        console.log(getError(err));
        setErrorNewsletters(getError(err));
      }
    };
    fetchNewsletter();
  }, [userInfo, salesQurrey]);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoadingRebatch(true);
        const { data } = await axios.get(
          `/api/newsletters/rebatch?q=${salesQurrey}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setRebatchs(data);
        setLoadingRebatch(false);
      } catch (err) {
        setLoadingRebatch(false);
        console.log(getError(err));
        setErrorRebatch(getError(err));
      }
    };
    fetchBatch();
  }, [userInfo, salesQurrey]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete")) {
      try {
        const { data } = await axios.delete(`/api/newsletters/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Email deleted Successfully",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        const filteredNewsletter = newsletters.map((newsletter) =>
          newsletter._id === id ? data : newsletter
        );
        setNewsletters(filteredNewsletter);
      } catch (err) {
        console.log(getError(err));
      }
    }
  };

  const sendEmails = async () => {
    try {
      if (selectedEmails.length === 0) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Select at least one email from the list",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      if (!emailName) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Select email type to send",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      setLoadingSend(true);
      await axios.post(
        "/api/newsletters/send",
        {
          emails: selectedEmails,
          emailName,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoadingSend(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Emails sent successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      setSelectedEmails([]);
    } catch (error) {
      setLoadingSend(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(error),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const handleEmailSelection = (newsletter) => {
    if (newsletter.isDeleted) {
      return;
    }
    if (
      emailName &&
      newsletter?.sent.some((obj) => obj.emailName === emailName)
    ) {
      return;
    }
    if (selectedEmails.includes(newsletter.email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== newsletter.email));
    } else {
      setSelectedEmails([...selectedEmails, newsletter.email]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      const selectedEmailSet = new Set(
        newsletters
          .filter(
            (newsletter) =>
              !newsletter.isDeleted && !hasMatchingEmailName(newsletter)
          )
          .map((newsletter) => newsletter.email)
      );
      setSelectedEmails([...selectedEmailSet]);
    }
    setSelectAll(!selectAll);
  };

  const handleAddEmail = async () => {
    try {
      setLoadingAdd(true);
      const { data } = await axios.post(
        `/api/newsletters/${region()}`,
        {
          email: inputEmail,
          emailType: "Newsletter",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setNewsletters([data, ...newsletters]);
      setLoadingAdd(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Emails added successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      setInputEmail("");
    } catch (error) {
      setLoadingAdd(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(error),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const hasMatchingEmailName = (newsletter) => {
    return (
      emailName && newsletter.sent.some((obj) => obj.emailName === emailName)
    );
  };

  return (
    <ProductLists mode={mode}>
      <Container>
        <Heading>Newsletter Emails</Heading>
        <ListItem1>
          <SubListItem>
            <Checkbox
              type="checkbox"
              mode={mode}
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <SelectAllLabel htmlFor="select-all">Select All</SelectAllLabel>
            <FormControl
              sx={{
                margin: 0,
                borderRadius: "0.2rem",
                marginLeft: "20px",
                width: 150,
                border: `1px solid ${
                  mode === "pagebodydark"
                    ? "var(--dark-ev4)"
                    : "var(--light-ev4)"
                }`,
                "& .MuiOutlinedInput-root": {
                  color: `${
                    mode === "pagebodydark"
                      ? "var(--white-color)"
                      : "var(--black-color)"
                  }`,
                  "&:hover": {
                    outline: 0,
                    border: 0,
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "0 !important",
                },
              }}
              size="small"
            >
              <Select
                value={emailName}
                onChange={(e) => setEmailName(e.target.value)}
                displayEmpty
                inputProps={{
                  "aria-label": "Without label",
                }}
              >
                <MenuItem value="">-- select --</MenuItem>
                {emailLists.length > 0 &&
                  emailLists.map((emailList) => (
                    <MenuItem value={emailList.name}>{emailList.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </SubListItem>
          {loadingSend ? (
            <LoadingBox />
          ) : (
            <Button onClick={sendEmails}>Send Email</Button>
          )}
        </ListItem1>
        <TextInput
          mode={mode}
          value={inputEmail}
          type="text"
          onChange={(e) => setInputEmail(e.target.value.trim())}
        />
        {loadingAdd ? (
          <LoadingBox />
        ) : (
          <Button onClick={handleAddEmail}>Add Email</Button>
        )}

        <List>
          {loadingNewsletters && <LoadingBox />}
          {newsletters.map((newsletter) => (
            <ListItem key={newsletter._id}>
              <SubListItem>
                <Checkbox
                  type="checkbox"
                  mode={mode}
                  checked={selectedEmails.includes(newsletter.email)}
                  onChange={() => handleEmailSelection(newsletter)}
                />
                <Email
                  style={
                    newsletter.isDeleted
                      ? { color: "gray", textDecoration: "line-through" }
                      : {}
                  }
                >
                  {newsletter.email}
                </Email>
                {emailName &&
                  newsletter?.sent.some(
                    (obj) => obj.emailName === emailName
                  ) && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color="var(--green-color)"
                      style={{
                        background: "white",
                        borderRadius: "50%",
                        marginLeft: "10px",
                      }}
                    />
                  )}
              </SubListItem>
              <Date>{moment(newsletter.createdAt).format("LLL")}</Date>
              <FontAwesomeIcon
                onClick={() => deleteHandler(newsletter._id)}
                icon={faTrash}
                style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ height: "100px" }} />
        <Heading>Rebatch emails</Heading>
        {/* <SearchCont>
        <SearchInput
          onChange={(e) => setSalesQurrey(e.target.value)}
          placeholder="Search by id"
        />
      </SearchCont> */}
        <List>
          {loadingRebatch && <LoadingBox />}
          {rebatchs.map((rebatch) => (
            <ListItem key={rebatch._id}>
              <SubListItem>
                <Checkbox
                  type="checkbox"
                  mode={mode}
                  checked={selectedEmails.includes(rebatch.email)}
                  onChange={() => handleEmailSelection(rebatch.email)}
                />
                <Email>{rebatch.email}</Email>
              </SubListItem>
              <Date>{moment(rebatch.createdAt).format("LLL")}</Date>
              <FontAwesomeIcon
                onClick={() => deleteHandler(rebatch._id)}
                icon={faTrash}
                style={{ color: "red", cursor: "pointer", marginLeft: 10 }}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </ProductLists>
  );
}
