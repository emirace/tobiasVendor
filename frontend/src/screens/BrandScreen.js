import axios from 'axios';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoadingBox from '../component/LoadingBox';
import { Store } from '../Store';
import useFetch from '../hooks/useFectch';
import MessageBox from '../component/MessageBox';
import {
  brandA,
  brandB,
  brandC,
  brandD,
  brandE,
  brandF,
  brandG,
  brandH,
  brandI,
  brandJ,
  brandK,
  brandL,
  brandM,
  brandN,
  brandO,
  brandP,
  brandQ,
  brandR,
  brandS,
  brandT,
  brandU,
  brandV,
  brandW,
  brandX,
  brandY,
  brandZ,
  brandnumbers,
} from '../constant';

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
  font-size: 20px;
  margin-right: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
`;
const BrandGroup = styled.div`
  margin: 20px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;
const Brand = styled.div`
  display: flex;
  width: 25%;
  cursor: pointer;
  margin-bottom: 10px;
  flex-direction: row;
  &:hover {
    color: var(--orange-color);
  }
  @media (max-width: 992px) {
    width: 50%;
  }
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

export default function BrandScreen() {
  const { state } = useContext(Store);
  const { mode } = state;

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  // const brandArray = Brands.split("\n");

  const scrollref = useRef(alphabet.map(React.createRef));

  const [query, setQuery] = useState('all');
  const [pageNum, setPageNum] = useState(1);
  const {
    isLoading,
    error,
    data: dataBrands,
    hasMore,
  } = useFetch(query, pageNum);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNum(1);
  };

  useEffect(() => {
    console.log('hellllooooo');
    headerList = [];
  }, [query, isLoading, dataBrands]);

  // useEffect(() => {
  //   const getBrand = async () => {
  //     const { data } = await axios.get("/api/brands");
  //     setDataBrands(data);
  //   };
  //   getBrand();
  // }, []);

  // const [searchBrand, setSearchBrand] = useState(null);
  // useEffect(() => {
  //   console.log(query);
  //   const getSearch = async () => {
  //     const { data } = await axios.get(`/api/brands/search?q=${query}`);
  //     console.log(data);
  //     setSearchBrand(data);
  //   };
  //   getSearch();
  // }, [query]);

  // const [updateNumber, setUpdateNumber] = useState(1);
  // const pageSize = 100;
  // useEffect(() => {
  //   const postbrand = () => {
  //     brandArray
  //       .slice(
  //         pageSize * (updateNumber - 1),
  //         pageSize * (updateNumber - 1) + pageSize
  //       )
  //       .map((y, i) => {
  //         // addBrand(y, y.charAt(0));
  //       });
  //     console.log(updateNumber);
  //   };
  //   postbrand();
  // }, [updateNumber]);

  const scrollToAlpha = (i) =>
    scrollref.current[i].current &&
    window.scrollTo({
      top: scrollref.current[i].current.offsetTop,
      behavior: 'smooth',
    });
  // const addBrand = async (brand, al) => {
  //   try {
  //     await axios.post("/api/brands", {
  //       name: brand.toLowerCase(),
  //       alpha: al,
  //     });
  //     console.log(brand);
  //   } catch (err) {
  //     console.log(getError(err));
  //   }
  // };
  const header = (alpha) => {
    if (headerList.includes(alpha)) {
      return;
    } else {
      headerList = [...headerList, alpha];
      return (
        <Header ref={scrollref.current[headerList.length]} mode={mode}>
          {alpha}
        </Header>
      );
    }
  };
  const navigate = useNavigate();
  const goto = (tag) => {
    navigate(`/brandpage/${tag}`);
  };

  return (
    <Container>
      <Title>Brands</Title>
      {/* <button onClick={() => setUpdateNumber((prev) => prev + 1)}>
        upload
      </button> */}
      <AlphaGroup>
        {[
          '&',
          '@',
          '1',
          '4',
          '2',
          '3',
          '5',
          '6',
          '7',
          '8',
          '9',
          ...alphabet,
        ].map((x, i) => (
          <div key={i} onClick={() => scrollToAlpha(i)}>
            <Alpha>{x}</Alpha>
          </div>
        ))}
      </AlphaGroup>
      <Search>
        <SearchInput onChange={handleChange} placeholder="Search brands" />
        {/* <SearchContainer mode={mode}>
          {searchBrand &&
            searchBrand.map((brand) => (
              <Link to={`/Search?brand=${brand.name}`}>
                <SearchData mode={mode}>{brand.name}</SearchData>
              </Link>
            ))}
        </SearchContainer> */}
      </Search>

      <Content>
        {/* {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ...alphabet].map(
          (x, i) => (
            <div key={i}>
              <Header ref={scrollref.current[i]} mode={mode}>
                {x}
              </Header> */}
        {/* <BrandGroup>
          {dataBrands.map((brand, i) => {
            // console.log(i, brand.name);
            // if (brand.alpha === x) {
            if (dataBrands.length === i + 1) {
              return (
                <Brand key={i} ref={lastBookElementRef}>
                  <Link to={`/search?query=${brand.name}`}>{brand.name}</Link>
                </Brand>
              );
            } else {
              return (
                <>
                  <Brand key={i}>
                    {header(brand.alpha)}
                    <Link to={`/search?query=${brand.name}`}>{brand.name}</Link>
                  </Brand>
                </>
              );
            }
            // }
          })}

          <div>{isLoading && <LoadingBox />}</div>
          <div>{error && <MessageBox>error......</MessageBox>}</div>
        </BrandGroup> */}
        {/* </div>
          )
        )} */}

        <Header>A</Header>
        <ButtonList strings={brandA} />
        <LoadMore onClick={() => goto('A')}>Load more</LoadMore>

        <Header>B</Header>
        <ButtonList strings={brandB} />
        <LoadMore onClick={() => goto('B')}>Load more</LoadMore>
        <Header>C</Header>
        <ButtonList strings={brandC} />
        <LoadMore onClick={() => goto('C')}>Load more</LoadMore>
        <Header>D</Header>
        <ButtonList strings={brandD} />
        <LoadMore onClick={() => goto('D')}>Load more</LoadMore>
        <Header>E</Header>
        <ButtonList strings={brandE} />
        <LoadMore onClick={() => goto('E')}>Load more</LoadMore>
        <Header>F</Header>
        <ButtonList strings={brandF} />
        <LoadMore onClick={() => goto('F')}>Load more</LoadMore>
        <Header>G</Header>
        <ButtonList strings={brandG} />
        <LoadMore onClick={() => goto('G')}>Load more</LoadMore>
        <Header>H</Header>
        <ButtonList strings={brandH} />
        <LoadMore onClick={() => goto('H')}>Load more</LoadMore>
        <Header>I</Header>
        <ButtonList strings={brandI} />
        <LoadMore onClick={() => goto('I')}>Load more</LoadMore>
        <Header>J</Header>
        <ButtonList strings={brandJ} />
        <LoadMore onClick={() => goto('J')}>Load more</LoadMore>
        <Header>K</Header>
        <ButtonList strings={brandK} />
        <LoadMore onClick={() => goto('K')}>Load more</LoadMore>
        <Header>L</Header>
        <ButtonList strings={brandL} />
        <LoadMore onClick={() => goto('L')}>Load more</LoadMore>
        <Header>M</Header>
        <ButtonList strings={brandM} />
        <LoadMore onClick={() => goto('M')}>Load more</LoadMore>
        <Header>N</Header>
        <ButtonList strings={brandN} />
        <LoadMore onClick={() => goto('N')}>Load more</LoadMore>
        <Header>O</Header>
        <ButtonList strings={brandO} />
        <LoadMore onClick={() => goto('O')}>Load more</LoadMore>
        <Header>P</Header>
        <ButtonList strings={brandP} />
        <LoadMore onClick={() => goto('P')}>Load more</LoadMore>
        <Header>Q</Header>
        <ButtonList strings={brandQ} />
        <LoadMore onClick={() => goto('Q')}>Load more</LoadMore>
        <Header>R</Header>
        <ButtonList strings={brandR} />
        <LoadMore onClick={() => goto('R')}>Load more</LoadMore>
        <Header>S</Header>
        <ButtonList strings={brandS} />
        <LoadMore onClick={() => goto('S')}>Load more</LoadMore>
        <Header>T</Header>
        <ButtonList strings={brandT} />
        <LoadMore onClick={() => goto('T')}>Load more</LoadMore>
        <Header>U</Header>
        <ButtonList strings={brandU} />
        <LoadMore onClick={() => goto('U')}>Load more</LoadMore>
        <Header>V</Header>
        <ButtonList strings={brandV} />
        <LoadMore onClick={() => goto('V')}>Load more</LoadMore>
        <Header>W</Header>
        <ButtonList strings={brandW} />
        <LoadMore onClick={() => goto('W')}>Load more</LoadMore>
        <Header>X</Header>
        <ButtonList strings={brandX} />
        <LoadMore onClick={() => goto('X')}>Load more</LoadMore>
        <Header>Y</Header>
        <ButtonList strings={brandY} />
        <LoadMore onClick={() => goto('Y')}>Load more</LoadMore>
        <Header>Z</Header>
        <ButtonList strings={brandZ} />
        <LoadMore onClick={() => goto('Z')}>Load more</LoadMore>
        <Header>#</Header>
        <ButtonList strings={brandnumbers} />
        <LoadMore>Load more</LoadMore>
      </Content>
    </Container>
  );
}

const ButtonList = ({ strings }) => {
  return (
    <div className="div-list">
      {strings.map((string, index) => (
        <div key={index}>{string}</div>
      ))}
      <div className="seemore">See more...</div>
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
        .seemore {
          font-weight: bold;
          color: var(--orange-color);
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
