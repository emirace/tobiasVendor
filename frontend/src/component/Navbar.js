import React, { useContext, useState } from "react";
import styled from "styled-components";
import IconsTooltips from "./IconsTooltips";
import {
	faEnvelope,
	faHeart,
	faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import { Store } from "../Store";

const Container = styled.div`
	width: 100%;
`;
const Wrapper = styled.div`
	padding-left: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--orange-color);
	overflow: auto;
	&::-webkit-scrollbar {
		display: none;
	}
`;
const Wrapper2 = styled.div`
	padding: 0 20px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Left = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	@media (max-width: 992px) {
		display: none;
	}
`;
const Center = styled.div`
	flex: 2;
	display: flex;
	justify-content: center;
	color: #fff;
	white-space: nowrap;
	@media (max-width: 992px) {
		animation: moving 25s infinite linear;
		@keyframes moving {
			0% {
				transform: translateX(50%);
			}
			100% {
				transform: translateX(-100%);
			}
		}
	}
`;
const Right = styled.div`
	flex: 1;
	content: "";
	display: flex;
	justify-content: end;
	@media (max-width: 992px) {
		display: none;
	}
`;
const Sell = styled.div`
	background-color: var(--malon-color);
	display: flex;
	padding: 5px 30px;
	justify-content: center;
	align-items: center;
	color: white;
	font-weight: bold;
`;

const Love = styled.div`
	position: relative;
	&:hover div {
		display: block;
	}
`;

const Logo = styled.div`
	flex: 1;
	font-size: 40px;
	font-weight: bold;
	text-transform: uppercase;
`;
const Search = styled.div`
	flex: 3;
`;
const RightMenu = styled.div`
	flex: 1;
	display: flex;
	justify-content: end;
	align-items: center;
`;

const MenuItem = styled.div`
	font-size: 20px;
	margin-left: 20px;
	position: relative;
	@media (max-width: 992px) {
		display: none;
	}
	&:hover {
		color: var(--orange-color);
	}
	&:hover div {
		display: block;
	}
`;
const MenuItemCart = styled.div`
	font-size: 20px;
	margin-left: 20px;
	position: relative;
	&:hover {
		color: var(--orange-color);
	}
	&:hover div {
		display: block;
	}
`;
const ProfileImg = styled.img.attrs({
	src: "/images/pimage.png",
})`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	cursor: pointer;
	margin-left: 20px;
	object-fit: cover;
	@media (max-width: 992px) {
		display: none;
	}
`;
const Category = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #dfdfdf;
	@media (max-width: 992px) {
		display: none;
	}
`;
const CategoryItem = styled.li`
	font-weight: bold;
	text-transform: capitalize;
	padding: 10px 20px;
	cursor: pointer;

	&:hover {
		color: var(--orange-color);
	}
`;
const CategoryGroup = styled.div`
	position: relative;
	&:hover ul {
		display: block;
	}
`;
const SubCategory = styled.ul.attrs({})`
	position: absolute;
	top: 35px;
	left: 20px;
	background: white;
	display: none;
	padding: 20px;
	z-index: 9;
`;
const SubCategoryItem = styled.li`
	white-space: nowrap;
	padding-bottom: 10px;
	cursor: pointer;
	&:hover {
		color: var(--orange-color);
		text-decoration: underline;
	}
`;
const Badge = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--orange-color);
	color: #fff;
	font-size: 10px;
	padding: 0 3px;
	border-radius: 50%;
	position: absolute;
	right: 0;
	top: 0;
`;

const SellButton = styled.div`
	background: var(--orange-color);
	cursor: pointer;
	color: #fff;
	border-radius: 10px;
	padding: 5px 20px;
	margin-left: 10px;
	display: none;
	&:hover {
		background: var(--malon-color);
	}
	@media (max-width: 992px) {
		display: block;
	}
`;

const SignIn = styled.div`
	margin-left: 10px;
	font-size: 13px;
	cursor: pointer;
	&:hover {
		color: var(--orange-color);
	}
	@media (max-width: 992px) {
		display: none;
	}
`;

export default function Navbar() {
	const { state } = useContext(Store);
	const { cart, userInfo } = state;

	return (
		<Container>
			<Wrapper>
				<Left></Left>
				<Center>
					50% discount on Newly Registered User...
					You Will Love
					<Love>
						<FontAwesomeIcon
							color="red"
							icon={faHeart}
						/>
						<IconsTooltips tips="Love" />
					</Love>
					Shopping with Us
				</Center>
				<Right>
					<Sell>Sell</Sell>
				</Right>
			</Wrapper>
			<Wrapper2>
				<Logo>
					<Link to="/">Tobias</Link>
				</Logo>

				<Search>
					<SearchBox />
				</Search>
				<RightMenu>
					<MenuItem>
						<FontAwesomeIcon
							icon={faEnvelope}
						/>
						<IconsTooltips tips="Messages" />
					</MenuItem>
					<MenuItemCart>
						<Link to="/cart">
							<FontAwesomeIcon
								icon={
									faShoppingCart
								}
							/>
						</Link>
						<IconsTooltips tips="Cart" />

						<Badge>
							{cart.cartItems.length >
								0 && (
								<span>
									{
										cart
											.cartItems
											.length
									}
								</span>
							)}
						</Badge>
					</MenuItemCart>
					<SellButton>Sell</SellButton>
					{userInfo ? (
						<Link to="/account">
							<ProfileImg />
						</Link>
					) : (
						<SignIn>
							<Link to="signin">
								Signin /
								Register
							</Link>
						</SignIn>
					)}
				</RightMenu>
			</Wrapper2>
			<Category>
				<CategoryGroup>
					<CategoryItem>Womenswear</CategoryItem>
					<SubCategory>
						<SubCategoryItem>
							Sub Category
						</SubCategoryItem>
						<SubCategoryItem>
							Sub Category
						</SubCategoryItem>
						<SubCategoryItem>
							Sub Category
						</SubCategoryItem>
					</SubCategory>
				</CategoryGroup>
				<CategoryGroup>
					<CategoryItem>Menswear</CategoryItem>
					<SubCategory>
						<SubCategoryItem>
							Sub Category 2
						</SubCategoryItem>
						<SubCategoryItem>
							Sub Category 2
						</SubCategoryItem>
						<SubCategoryItem>
							Sub Category 2
						</SubCategoryItem>
					</SubCategory>
				</CategoryGroup>
				<CategoryItem>Kids</CategoryItem>
				<CategoryItem>Curve +Plus</CategoryItem>
				<CategoryItem>Shop by brand</CategoryItem>
				<CategoryItem>Shop by outfit</CategoryItem>
			</Category>
		</Container>
	);
}
