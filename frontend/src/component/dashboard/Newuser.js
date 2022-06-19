import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";

const Container = styled.div`
    flex: 4;
    padding: 0 20px;
`;
const Title = styled.h1``;
const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
`;
const Item = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-top: 10px;
    margin-right: 20px;
`;
const Label = styled.label`
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
`;
const Input = styled.input`
    background: none;
    color: ${(props) =>
        props.mode === "pagebodydark"
            ? "var(--white-color)"
            : "var(--dark-color)"};
    border: 1px solid
        ${(props) =>
            props.mode === "pagebodydark"
                ? "var(--dark-ev3)"
                : "var(--light-ev3)"};
    border-radius: 0.2rem;
    height: 40px;
    padding: 10px;
    &:focus-visible {
        outline: 1px solid var(--orange-color);
    }
`;
const Gender = styled.div`
    display: flex;
    align-items: center;

    & input {
        &::after {
            width: 15px;
            height: 15px;
            content: "";
            display: inline-block;
            visibility: visible;
            border-radius: 15px;
            position: relative;
            top: 11px;
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
            border-radius: 15px;
            position: relative;
            top: 11px;
            left: -1px;
            background-color: var(--orange-color);
            border: 1px solid var(--orange-color);
        }
    }
    & label {
        margin: 10px;
        font-size: 18px;
        font-weight: 300;
    }
`;

const Button = styled.button`
    width: 200px;
    border: none;
    background: var(--orange-color);
    color: var(--white-color);
    padding: 5px 10px;
    border-radius: 0.2rem;
    cursor: pointer;
    margin-top: 20px;
    &.add {
        margin-top: 0;
        width: 80px;
    }
`;
const InputCont = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
`;
const CatList = styled.div`
    background: ${(props) =>
        props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
let subCategories = [];
export default function Newuser() {
    const { state } = useContext(Store);
    const { mode } = state;
    const [currentCat, setCurrentCat] = useState("");

    const submitHandler = () => {};

    const sizeHandler = (sizenow) => {
        const exist = subCategories.filter((s) => {
            return s === sizenow;
        });
        if (exist.length > 0) {
            const newsizes = subCategories.filter((s) => {
                return s.size !== sizenow;
            });
            subCategories = newsizes;
        } else {
            subCategories.push(sizenow);
        }
    };
    return (
        <Container>
            <Title>Categories</Title>
            <Item>
                <Label>Category Name</Label>
                <Input
                    mode={mode}
                    type="text"
                    placeholder="Enter category name"
                />
            </Item>
            {subCategories}
            {subCategories.map((c) => (
                <CatList>{c}</CatList>
            ))}
            <Item>
                <Label>Sub Categories</Label>
                <InputCont>
                    <Input
                        mode={mode}
                        className="half"
                        type="text"
                        placeholder="Enter Sub category"
                        onChange={(e) => setCurrentCat(e.target.value)}
                    />
                    <Button
                        className="add"
                        onClick={(e) => sizeHandler(currentCat)}
                    >
                        Add
                    </Button>
                </InputCont>
            </Item>
            <Button>Add Category</Button>
        </Container>
    );
}
