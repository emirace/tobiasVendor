import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../../Store";
import { Link } from "react-router-dom";
import axios from "axios";
import { getError } from "../../utils";

const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Title = styled.h1`
  padding: 20px 20px 0 20px;
`;
const Product = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }
  & a {
    &:hover {
      text-decoration: underline;
    }
  }
`;
const Edit = styled.button`
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: var(--orange-color);
  cursor: pointer;
  margin-right: 10px;
`;

const ActionSec = styled.div`
  & svg {
    color: var(--red-color);
    cursor: pointer;
    &:hover {
      font-size: 18px;
    }
  }
`;
const Stock = styled.div`
  color: var(--green-color);
  &.empty {
    color: var(--red-color);
  }
`;

const SearchCont = styled.div`
  display: flex;
  justify-content: end;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  width: 40%;
  height: 45px;
  padding: 15px;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  &::placeholder {
    padding: 10px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "USERS_REQUEST":
      return { ...state, loading: true };
    case "USERS_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case "USERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListAdmin() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, products, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: "",
    });
  const sellerMode = () => {
    return userInfo.isAdmin ? false : true;
  };
  const isSellerMode = sellerMode();
  const [productsQuery, setProductsQuery] = useState("all");
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        dispatch({ type: "USERS_FETCH" });
        const { data } = await axios.get(
          `/api/products/${isSellerMode ? "seller/search/" : "admin"}${
            isSellerMode ? userInfo._id : ""
          }?q=${productsQuery}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "USERS_SUCCESS", payload: data.products });
      } catch (err) {
        console.log(getError(err));
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchAllProduct();
    }
  }, [successDelete, userInfo, productsQuery]);

  const deleteHandler = async (product) => {
    console.log("params", product);
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/products/${product}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <Product>
            <img src={params.row.image} alt="" />
            <Link to={`/product/${params.row.slug}`}>{params.row.name}</Link>
          </Product>
        );
      },
    },
    { field: "stock", headerName: "Stock", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return params.row.stock ? (
          <Stock>{params.row.stock ? "In Stock" : "Out of Stock"}</Stock>
        ) : (
          <Stock className="empty">
            {params.row.stock ? "In Stock" : "Out of Stock"}
          </Stock>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <ActionSec>
            <Link to={`/dashboard/product/${params.row.id}`}>
              <Edit mode={mode}>Edit</Edit>
            </Link>
            {userInfo.isAdmin && (
              <FontAwesomeIcon
                onClick={() => deleteHandler(params.row.id)}
                icon={faTrash}
              />
            )}
          </ActionSec>
        );
      },
    },
  ];
  const rows = products.map((p) => ({
    id: p._id,
    name: p.name,
    image: p.image,
    stock: p.countInStock,
    price: "$" + p.price,
    slug: p.slug,
  }));

  return (
    <ProductLists mode={mode}>
      <Title>My Products</Title>
      <SearchCont>
        <SearchInput
          onChange={(e) => setProductsQuery(e.target.value)}
          placeholder="Search "
        />
      </SearchCont>
      <DataGrid
        sx={{
          width: "100%",
          height: "650px",
          color: `${
            mode === "pagebodydark"
              ? "var(--white-color)"
              : "var(--black-color)"
          }`,
          border: "none",
          "& p.MuiTablePagination-displayedRows": {
            margin: 0,
            color: `${
              mode === "pagebodydark"
                ? "var(--white-color)"
                : "var(--black-color)"
            }`,
          },
          "& .MuiButtonBase-root": {
            color: `${
              mode === "pagebodydark"
                ? "var(--white-color)"
                : "var(--black-color)"
            }`,
          },
          "& .MuiDataGrid-columnHeaders": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .Mui-checked": {
            color: "var(--orange-color) !important",
          },
          "& .Mui-selected": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"
            } !important`,
          },
          "& .MuiDataGrid-row:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"
            } !important`,
          },
          "& .Mui-selected:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"
            } !important`,
          },

          "& .MuiDataGrid-cell:focus": {
            outline: "solid var(--orange-color) 1px  !important",
            borderRadius: "0.2rem",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "solid var(--orange-color) 1px  !important",
            borderRadius: "0.2rem",
          },
          "& .MuiCheckbox-root:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"
            }   !important`,
          },
          "& .MuiDataGrid-columnHeader:focus-within,.MuiDataGrid-cell:focus-within":
            {
              outline: "solid var(--orange-color) 1px  !important",
              borderRadius: "0.2rem",
            },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </ProductLists>
  );
}
