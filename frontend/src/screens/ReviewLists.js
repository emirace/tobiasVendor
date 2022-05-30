import styled from "styled-components";
import React, { useContext, useState } from "react";
import { Store } from "../Store";

const Container = styled.div`
  
  height: 100%;
  width: 100%;
  padding;10px;
`;

const Tab = styled.div`
    display: flex;
    margin-bottom: 5ps;
    justify-content: center;
`;
const Content = styled.div``;
const TabItem = styled.div`
    display: flex;
    justify-content: crnter;
    cursor: pointer;
    margin: 10px;
    position: relative;
    min-width: 50px;
    &:hover {
        color: var(--orange-color);
    }
    &.active {
        color: var(--orange-color);
        font-weight: bold;
        &::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--orange-color);
        }
    }
`;

export default function ReviewLists() {
    const { state } = useContext(Store);
    const { mode } = state;

    const [displayTab, setDisplayTab] = useState("sold");

    const tabSwitch = (tab) => {
        switch (tab) {
            case "sold":
                return <>sold reviews</>;
            case "purchase":
                return <>purchase reviwws</>;
            default:
                return <></>;
        }
    };

    return (
        <Container>
            <Tab>
                <TabItem
                    className={displayTab === "sold" && "active"}
                    onClick={() => setDisplayTab("sold")}
                >
                    Sold
                </TabItem>
                <TabItem
                    className={displayTab === "purchase" && "active"}
                    onClick={() => setDisplayTab("purchase")}
                >
                    Purchase
                </TabItem>
            </Tab>
            <Content>{tabSwitch(displayTab)}</Content>
        </Container>
    );
}
