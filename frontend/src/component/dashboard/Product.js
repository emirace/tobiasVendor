import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Chart from './Chart';

const ProductC = styled.div`
  flex: 4;
  padding: 20px;
`;

const ProductTitleCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1``;
const AddButton = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  background: var(--orange-color);
  color: var(--white-color);
  border-radius: 0.2rem;
  cursor: pointer;
`;

const Top = styled.div`
  display: flex;
`;
const Bottom = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 0.2rem;
  background: var(--dark-ev1);
`;
const TopLeft = styled.div`
  flex: 1;
`;
const TopRight = styled.div`
  flex: 1;
  padding: 20px;
  background: var(--dark-ev1);
  margin: 20px;
  border-radius: 0.2rem;
`;
const InfoTop = styled.div`
  display: flex;
  align-items: center;
`;
const InfoBottom = styled.div`
  margin-top: 10px;
`;
const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;
const Name = styled.div`
  font-weight: 600;
`;
const InfoItem = styled.div`
  width: 150px;
  display: flex;
  justify-content: space-between;
`;
const InfoKey = styled.span``;
const InfoValue = styled.span`
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
`;
const FormLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
const FormRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Input = styled.input`
  width: 250px;
  margin-bottom: 10px;
  border: none;
  padding: 5px;
  border-bottom: 1px solid var(--dark-ev3);
  background: none;
  &:focus-visible {
    outline: none;
    border-bottom: 1px solid var(--orange-color);
  }
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
`;
const Upload = styled.form`
  display: flex;
  align-items: center;
`;
const UploadImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
  object-position: top;
`;
const Button = styled.button`
  border: none;
  padding: 5px;
  border-radius: 0.2rem;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
`;
const UploadInput = styled.input`
  display: none;
`;
const Gender = styled.div`
  display: flex;
  align-items: center;

  & input {
    &::after {
      width: 15px;
      height: 15px;
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: 11px;
      left: -1px;
      background-color: var(--black-color);
      border: 1px solid var(--orange-color);
    }
    &:checked::after {
      width: 15px;
      height: 15px;
      content: '';
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
const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 10px;
  margin-right: 20px;
`;

export default function Product() {
  const productData = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
  ];
  return (
    <ProductC>
      <ProductTitleCont>
        <Title>Product</Title>
        <AddButton>Create</AddButton>
      </ProductTitleCont>
      <Top>
        <TopLeft>
          <Chart title="Sales Performance" data={productData} dataKey="uv" />
        </TopLeft>
        <TopRight>
          <InfoTop>
            <Image src="/images/card1.png" alt="" />
            <Name>Slim Shirt</Name>
          </InfoTop>
          <InfoBottom>
            <InfoItem>
              <InfoKey>id:</InfoKey>
              <InfoValue>1252524415203</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>sold:</InfoKey>
              <InfoValue>12</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>active:</InfoKey>
              <InfoValue>yes</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>in stock:</InfoKey>
              <InfoValue>no</InfoValue>
            </InfoItem>
          </InfoBottom>
        </TopRight>
      </Top>
      <Bottom>
        <Form>
          <FormLeft>
            <Label>Product Name</Label>
            <Input type="text" placeholder="Product Name" />
            <Label>Active</Label>
            <Gender>
              <Input type="radio" name="gender" id="yes" value="yes" />
              <Label htmlFor="yes">Yes</Label>
              <Input type="radio" name="gender" id="no" value="no" />
              <Label htmlFor="no">No</Label>
            </Gender>
          </FormLeft>
          <FormRight>
            <Upload>
              <UploadImg src="/images/card1.png" alt="" />
              <Label For="file">
                <FontAwesomeIcon icon={faUpload} />
              </Label>
              <UploadInput type="file" id="file" />
            </Upload>
            <Button>Update</Button>
          </FormRight>
        </Form>
      </Bottom>
    </ProductC>
  );
}
