import { faCircleDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Rating from "../component/Rating";
import { Store } from "../Store";
import { getError } from "../utils";

const Left = styled.div`
  flex: 1;
  height: calc(100vh-168px);
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  position: sticky;
  border-radius: 0.2rem;
  margin-bottom: 20px;
  top: 168px;
  @media (max-width: 992px) {
    left: ${(props) => (props.showFilter ? 0 : "-100vw")};
    display: ${(props) => (props.showFilter ? "block" : "none")};
    transition: left 2s;
    z-index: 9;
    position: absolute;
    width: 100vw;
    top: 0;
  }
`;

const Close = styled.div`
  display: none;
  justify-content: end;
  margin: 5px;
  padding: 10px 20px;
  & svg {
    font-size: 15px;
  }
  @media (max-width: 992px) {
    display: flex;
  }
`;
const Filter = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--orange-color);
  width: 100%;
  text-align: center;
  z-index: 9;
  padding: 5px 7px;
  color: white;
`;

const Wrapper = styled.div`
  padding: 20px;
`;
const Menu = styled.div`
  margin-bottom: 10px;
  & .text-bold {
    color: var(--orange-color);
  }
`;
const Title = styled.h3`
  font-size: 14px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &::after {
    content: " ";
    width: 8px;
    height: 8px;
    border-bottom: 1px solid;
    border-left: 1px solid;
    transform: rotate(-45deg) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20px;
  }
  &.activate::after {
    content: "";
    transform: rotate(135deg);
  }
`;

const Input = styled.input`
  background: none;
  border: 1px solid var(--malon-color);
  padding: 5px 10px;
  border-radius: 0.4rem;
  margin-top: 5px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
`;

const List = styled.ul`
  padding: 5px;
  height: 0;
  overflow: hidden;
  transition: 0.5s;
  &.activate {
    height: 100%;
  }
`;

const ListItem = styled.li`
  padding: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  &.active,
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"};
  }
  & svg {
    margin-right: 5px;
    font-size: 8px;
    color: var(--malon-color);
  }
`;

const Color = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const color1 = [
  { name: "red", id: 1 },
  { name: "#383e42", id: 2 },
  { name: "beige", id: 3 },
  { name: "black", id: 4 },
  { name: "blue", id: 5 },
  { name: "brown", id: 6 },
  { name: "#800020", id: 7 },
  { name: "#c19a6b", id: 8 },
  { name: "#C2B280", id: 9 },
  { name: "gold", id: 10 },
  { name: "green", id: 11 },
  { name: "grey", id: 12 },
  { name: "khaki", id: 13 },
  { name: "#aaa9ad", id: 14 },
  { name: "multiculour", id: 15 },
  { name: "navy", id: 16 },
  { name: "orange", id: 17 },
  { name: "pink", id: 18 },
  { name: "purple", id: 19 },
  { name: "silver", id: 20 },
  { name: "turquoise", id: 21 },
  { name: "white", id: 22 },
  { name: "yellow", id: 23 },
];
const sizelist = [
  { id: 1, name: "XS" },
  { id: 0, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "XL" },
  { id: 5, name: "XXL" },
];

const shippinglist = [
  { id: 2, name: "Free" },
  { id: 3, name: "Discount + Free" },
];
const conditionlist = [
  { id: 2, name: "New with Tags" },
  { id: 3, name: "New with No Tags" },
];
const typelist = [
  { id: 2, name: "Re:Curated" },
  { id: 3, name: "Bulk n Slot" },
];
const availabilitylist = [
  { id: 2, name: "In Someone's cart" },
  { id: 3, name: "In Someone's wish-list" },
  { id: 4, name: "Recently Added" },
  { id: 5, name: "Dropping Soon" },
  { id: 6, name: "Sold Items" },
  { id: 7, name: "Trending" },
];

const patternlist = [
  { id: 1, name: "Acrylic" },
  { id: 2, name: "Cashmere" },
  { id: 3, name: "Cloth" },
  { id: 4, name: "Cotton" },
  { id: 5, name: "Exotic leathers" },
  { id: 6, name: "Faux fur" },
  { id: 7, name: "Fur" },
  { id: 8, name: "Leather" },
  { id: 9, name: "Linen" },
  { id: 10, name: "Polyester" },
  { id: 11, name: "Polyurethane" },
  { id: 12, name: "Pony-style calfskin" },
  { id: 13, name: "Suede" },
  { id: 14, name: "Silk" },
  { id: 15, name: "Rayon" },
  { id: 16, name: "Synthetic" },
  { id: 17, name: "Spandex" },
  { id: 18, name: "Tweed" },
  { id: 19, name: "Vegan leather" },
  { id: 20, name: "Velvet" },
  { id: 21, name: "Wool" },
];

const deals = [
  {
    name: "On Sale Now",
    id: 1,
    value: "on-sale",
  },
  {
    name: "Up to 50% Off",
    id: 2,
    value: "50",
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1star & up",
    rating: 1,
  },
];

export default function SearchFilter({
  showFilter,
  setShowFilter,
  category,
  order,
  page,
  price,
  query,
  rating,
  brand,
  color,
  size,
  deal,
  shipping,
  condition,
  availability,
  type,
  pattern,
}) {
  const { state } = useContext(Store);
  const { mode, userInfo, currency } = state;

  const [cateClass, setCateClass] = useState(true);
  const [priceClass, setPriceClass] = useState(true);
  const [reviewClass, setReviewClass] = useState(true);
  const [colorClass, setColorClass] = useState(true);
  const [sizeClass, setSizeClass] = useState(true);
  const [brandClass, setBrandClass] = useState(true);
  const [dealClass, setDealClass] = useState(true);
  const [shippingClass, setShippingClass] = useState(true);
  const [conditionClass, setConditionClass] = useState(true);
  const [availabilityClass, setAvailabilityClass] = useState(true);
  const [typeClass, setTypeClass] = useState(true);
  const [patternClass, setPatternClass] = useState(true);
  const [categories, setCategories] = useState([]);

  const [queryBrand, setQueryBrand] = useState(null);
  const [searchBrand, setSearchBrand] = useState(null);

  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const { data } = await axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategories(data);
      };
      fetchCategories();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo]);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterOrder = filter.order || order;
    const filterColor = filter.color || color;
    const filterBrand = filter.brand || brand;
    const filterSize = filter.size || size;
    const filterDeal = filter.deal || deal;
    const filterShipping = filter.shipping || shipping;
    const filterCondition = filter.condition || condition;
    const filterAvailability = filter.availability || availability;
    const filterType = filter.type || type;
    const filterPattern = filter.pattern || pattern;
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&color=${filterColor}&brand=${filterBrand}&size=${filterSize}&deal=${filterDeal}&shipping=${filterShipping}&condition=${filterCondition}&availability=${filterAvailability}&type=${filterType}&pattern=${filterPattern}`;
  };

  const toggleCollapse = (type) => {
    switch (type) {
      case "category":
        setCateClass(!cateClass);
        break;
      case "price":
        setPriceClass(!priceClass);
        break;
      case "review":
        setReviewClass(!reviewClass);
        break;
      case "color":
        setColorClass(!colorClass);
        break;
      case "size":
        setSizeClass(!sizeClass);
        break;
      case "shipping":
        setShippingClass(!shippingClass);
        break;
      case "condition":
        setConditionClass(!conditionClass);
        break;
      case "availability":
        setAvailabilityClass(!availabilityClass);
        break;
      case "type":
        setTypeClass(!typeClass);
        break;
      case "pattern":
        setPatternClass(!patternClass);
        break;
      case "brand":
        setBrandClass(!brandClass);
        break;
      case "deal":
        setDealClass(!dealClass);
        break;

      default:
        break;
    }
  };

  const handleInput = (e) => {
    e.preventDefault();

    if (e.target.value.length > 2) {
      setQueryBrand(e.target.value);
    }
  };

  const prices = [
    {
      name: `${currency}1 to ${currency}50`,
      id: 1,
      value: "1-50",
    },
    {
      name: `${currency}51 to ${currency}200`,
      id: 2,
      value: "51-200",
    },
    {
      name: `${currency}201 to ${currency}1000`,
      id: 3,
      value: "201-1000",
    },
  ];
  return (
    <Left mode={mode} showFilter={showFilter}>
      <Close onClick={() => setShowFilter(false)}>
        <FontAwesomeIcon icon={faTimes} />
      </Close>
      {showFilter && (
        <Filter onClick={() => setShowFilter(false)}>Filter</Filter>
      )}

      <Wrapper>
        <Menu>
          <Title onClick={() => toggleCollapse("category")}>Categories</Title>
          <List className={cateClass ? "activate" : ""}>
            <Link
              className={"all" === category ? "text-bold" : ""}
              to={getFilterUrl({ category: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {categories.length &&
              categories.map((c) => (
                <Link
                  className={c.name === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: c.name })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    {c.name}
                  </ListItem>
                </Link>
              ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("brand")}>Brands</Title>
          <List className={brandClass ? "activate" : ""}>
            <Input
              mode={mode}
              type="text"
              placeholder="Search brands"
              onChange={handleInput}
            />
            <Link
              className={"all" === brand ? "text-bold" : ""}
              to={getFilterUrl({ brand: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {searchBrand &&
              searchBrand.map((p, index) => (
                <div key={p._id}>
                  <Link
                    className={p.name === brand ? "text-bold" : ""}
                    to={getFilterUrl({ brand: p.name })}
                  >
                    <ListItem mode={mode}>
                      <FontAwesomeIcon icon={faCircleDot} />
                      {p.name}
                    </ListItem>
                  </Link>
                </div>
              ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("price")}>Prices</Title>
          <List className={priceClass ? "activate" : ""}>
            <Link
              className={"all" === price ? "text-bold" : ""}
              to={getFilterUrl({ price: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {prices.map((p, index) => (
              <div key={p.id}>
                <Link
                  className={p.value === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: p.value })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    {p.name}
                  </ListItem>
                </Link>
              </div>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title
            className={dealClass ? "activate" : ""}
            onClick={() => toggleCollapse("deal")}
          >
            Deals
          </Title>
          <List className={dealClass ? "activate" : ""}>
            <Link
              className={"all" === deal ? "text-bold" : ""}
              to={getFilterUrl({ deal: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {deals.map((p) => (
              <div key={p.id}>
                <Link
                  className={p.value === deal ? "text-bold" : ""}
                  to={getFilterUrl({ deal: p.value })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    {p.name}
                  </ListItem>
                </Link>
              </div>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title
            className={reviewClass ? "activate" : ""}
            onClick={() => toggleCollapse("review")}
          >
            Reviews
          </Title>
          <List className={reviewClass ? "activate" : ""}>
            {ratings.map((r) => (
              <div key={r.rating}>
                <Link
                  className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                  to={getFilterUrl({ rating: r.rating })}
                >
                  <ListItem mode={mode}>
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </ListItem>
                </Link>
              </div>
            ))}
            <Link
              className={rating === "all" ? "text-bold" : ""}
              to={getFilterUrl({ rating: "all" })}
            >
              <ListItem mode={mode}>
                <Rating caption={" & up"} rating={0}></Rating>
              </ListItem>
            </Link>
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("color")}>Color</Title>
          <List className={colorClass ? "activate" : ""}>
            <Link
              className={"all" === color ? "text-bold" : ""}
              to={getFilterUrl({ color: "all" })}
            >
              <ListItem mode={mode}>All</ListItem>
            </Link>
            <Color>
              {color1.map((c, i) => (
                <Link
                  key={c.id}
                  className={c.name === color ? "text-bold" : ""}
                  to={getFilterUrl({ color: c.name })}
                >
                  <ListItem mode={mode}>
                    <div
                      style={{
                        background: c.name,
                        width: "30px",
                        height: "20px",
                        borderRadius: "0.2rem",
                      }}
                    ></div>
                  </ListItem>
                </Link>
              ))}
            </Color>
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("size")}>Size</Title>
          <List className={sizeClass ? "activate" : ""}>
            <Link
              className={"all" === size ? "text-bold" : ""}
              to={getFilterUrl({ size: "all" })}
            >
              <ListItem mode={mode}>All</ListItem>
            </Link>
            <Color>
              {sizelist.map((c, i) => (
                <Link
                  key={c.id}
                  className={c.name === size ? "text-bold" : ""}
                  to={getFilterUrl({ size: c.name })}
                >
                  <ListItem mode={mode}>
                    <div
                      style={{
                        justifyContent: "center",
                        textTransform: "uppercase",
                        borderWidth: "1px",
                        width: "30px",
                        height: "20px",
                        borderRadius: "0.2rem",
                      }}
                    >
                      {c.name}
                    </div>
                  </ListItem>
                </Link>
              ))}
            </Color>
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("shipping")}>Shipping</Title>
          <List className={shippingClass ? "activate" : ""}>
            <Link
              className={"all" === shipping ? "text-bold" : ""}
              to={getFilterUrl({ shipping: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All Product
              </ListItem>
            </Link>
            {shippinglist.map((c, i) => (
              <Link
                key={c.id}
                className={c.name === shipping ? "text-bold" : ""}
                to={getFilterUrl({ shipping: c.name })}
              >
                <ListItem mode={mode}>
                  <FontAwesomeIcon icon={faCircleDot} />
                  {c.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("condition")}>Condition</Title>
          <List className={conditionClass ? "activate" : ""}>
            <Link
              className={"all" === condition ? "text-bold" : ""}
              to={getFilterUrl({ condition: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All Condition
              </ListItem>
            </Link>
            {conditionlist.map((c, i) => (
              <Link
                key={c.id}
                className={c.name === condition ? "text-bold" : ""}
                to={getFilterUrl({ condition: c.name })}
              >
                <ListItem mode={mode}>
                  <FontAwesomeIcon icon={faCircleDot} />
                  {c.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("availability")}>
            Availability
          </Title>
          <List className={availabilityClass ? "activate" : ""}>
            <Link
              className={"all" === availability ? "text-bold" : ""}
              to={getFilterUrl({ availability: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {availabilitylist.map((c, i) => (
              <Link
                key={c.id}
                className={c.name === availability ? "text-bold" : ""}
                to={getFilterUrl({ availability: c.name })}
              >
                <ListItem mode={mode}>
                  <FontAwesomeIcon icon={faCircleDot} />
                  {c.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("type")}>Type</Title>
          <List className={typeClass ? "activate" : ""}>
            <Link
              className={"all" === type ? "text-bold" : ""}
              to={getFilterUrl({ type: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {typelist.map((c, i) => (
              <Link
                key={c.id}
                className={c.name === type ? "text-bold" : ""}
                to={getFilterUrl({ type: c.name })}
              >
                <ListItem mode={mode}>
                  <FontAwesomeIcon icon={faCircleDot} />
                  {c.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Menu>
        <Menu>
          <Title onClick={() => toggleCollapse("pattern")}>
            Pattern & Printed
          </Title>
          <List className={patternClass ? "activate" : ""}>
            <Link
              className={"all" === pattern ? "text-bold" : ""}
              to={getFilterUrl({ pattern: "all" })}
            >
              <ListItem mode={mode}>
                <FontAwesomeIcon icon={faCircleDot} />
                All
              </ListItem>
            </Link>
            {patternlist.map((c, i) => (
              <Link
                key={c.id}
                className={c.name === pattern ? "text-bold" : ""}
                to={getFilterUrl({ pattern: c.name })}
              >
                <ListItem mode={mode}>
                  <FontAwesomeIcon icon={faCircleDot} />
                  {c.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Menu>
      </Wrapper>
    </Left>
  );
}
