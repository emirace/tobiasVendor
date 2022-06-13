import React, { useContext } from "react";
import styled from "styled-components";
import { Store } from "../../Store";

const NewProductC = styled.div`
    flex: 4;
    margin: 0 20px;
    padding: 20px;
    border-radius: 0.2rem;
    background: ${(props) =>
        props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const TitleCont = styled.div`
    margin-bottom: 20px;
`;
const Title = styled.h1`
    font-size: 28px;
`;
const TitleDetails = styled.span`
    width: 70%;
    font-size: 14px;
`;
const Content = styled.div``;
const Left = styled.div`
    flex: 1;
`;
const Right = styled.div`
    flex: 1;
`;
const Form = styled.form`
    display: flex;
    gap:20px:
`;
const Item = styled.div`
display:flex;
flex-direction:column;
width:400px;
msrgim:10px 20px 0 0:
`;
const TextInput = styled.input`
    background: none;
    color: ${(props) =>
        props.mode === "pagebodydark"
            ? "var(--white-color)"
            : "var(--black-color)"};
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
const Label = styled.label`
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
`;
export default function NewProduct() {
    const { state } = useContext(Store);
    const { mode } = state;
    return (
        <NewProductC mode={mode}>
            <TitleCont>
                <Title>NewProduct</Title>
                <TitleDetails>
                    When adding product, do not ignore to fill relavant fields
                    and following the product adding rules
                </TitleDetails>
            </TitleCont>
            <Content>
                <Form>
                    <Left>
                        <Item>
                            <Label>Product Name</Label>
                            <TextInput mode={mode} type="text" />
                        </Item>
                    </Left>
                    <Right>Right</Right>
                </Form>
            </Content>
        </NewProductC>
    );
}
