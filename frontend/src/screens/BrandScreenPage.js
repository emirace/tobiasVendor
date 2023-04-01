import axios from 'axios';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingBox from '../component/LoadingBox';
import { Store } from '../Store';
import useFetch from '../hooks/useFectch';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';

const Container = styled.div``;
const Alpha = styled.div`
  padding: 5px;
  margin: 5px;
  font-size: 20px;
  font-weight: 300;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
  }
  @media (max-width: 992px) {
    padding: 0;
    font-size: 12px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
const AlphaGroup = styled.div`
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
`;
const Content = styled.div`
  margin-top: 10px;
  margin: 0 10vw;
  @media (max-width: 992px) {
    margin: 0 5vw;
  }
`;
const Header = styled.div`
  width: 30px;
  border-radius: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-right: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
`;

const Search = styled.div`
  margin: 0 5vw;
  position: relative;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 15px;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  &::placeholder {
    padding: 10px;
  }
`;
const SearchData = styled.div`
  padding: 5px;
  color: grey;
  text-tranform: capitalize;
  &:hover {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
  }
`;
const SearchContainer = styled.div`
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  position: absolute;
  top: 50px;
  width: 100%;
`;
const LoadMore = styled.div`
  width: 100%;
  text-align: right;
  cursor: pointer;
`;

var headerList = [];

export default function BrandScreenPage() {
  const { state } = useContext(Store);
  const { mode } = state;

  const [query, setQuery] = useState('all');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const observer = useRef();

  const params = useParams();
  const { id } = params;

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const getBrand = async () => {
      try {
        const { data } = await axios.get(`/api/brands/${id}`);
        setBrands(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(getError(error));
      }
    };
    getBrand();
  }, []);

  const [searchBrand, setSearchBrand] = useState(null);
  useEffect(() => {
    console.log(query);
    const getSearch = async () => {
      const { data } = await axios.get(`/api/brands/search?q=${query}`);
      console.log(data);
      setSearchBrand(data);
    };
    getSearch();
  }, [query]);

  return (
    <Container>
      <Title>Brands {id}</Title>

      <Search>
        <SearchInput onChange={handleChange} placeholder="Search brands" />
        <SearchContainer mode={mode}>
          {searchBrand &&
            searchBrand.map((brand) => (
              <Link to={`/Search?brand=${brand.name}`}>
                <SearchData mode={mode}>{brand.name}</SearchData>
              </Link>
            ))}
        </SearchContainer>
      </Search>

      <Content>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <ButtonList strings={brands} />
        )}
      </Content>
    </Container>
  );
}

const ButtonList = ({ strings }) => {
  return (
    <div className="div-list">
      {strings.map((string, index) => (
        <div key={index}>{string.name}</div>
      ))}
      <style jsx>{`
        .div-list {
          display: flex;
          flex-wrap: wrap;
        }
        .div-list div {
          width: 100%;
          text-align: left;
          text-transform: capitalize;
          padding: 5px;
          border-bottom: 1px solid grey;
        }
        @media (min-width: 768px) {
          .div-list div {
            width: 33.33%;
            padding: 5px 24px;
            border-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};
