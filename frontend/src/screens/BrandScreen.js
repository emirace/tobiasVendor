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
  margin-top: 20px;
  font-size: 20px;
  margin-right: 20px;
  margin-left: 20px;
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

  return (
    <Container>
      <Title>Brands</Title>
      {/* <button onClick={() => setUpdateNumber((prev) => prev + 1)}>
        upload
      </button> */}
      <AlphaGroup>
        {['#', ...alphabet].map((x, i) => (
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

        <Header ref={scrollref.current['A']}>A</Header>
        <ButtonList alpha={'A'} strings={brandA} />

        <Header ref={scrollref.current['B']}>B</Header>
        <ButtonList alpha={'B'} strings={brandB} />

        <Header ref={scrollref.current['C']}>C</Header>
        <ButtonList alpha={'C'} strings={brandC} />

        <Header ref={scrollref.current['D']}>D</Header>
        <ButtonList alpha={'D'} strings={brandD} />

        <Header ref={scrollref.current['E']}>E</Header>
        <ButtonList alpha={'E'} strings={brandE} />

        <Header ref={scrollref.current['F']}>F</Header>
        <ButtonList alpha={'F'} strings={brandF} />

        <Header ref={scrollref.current['G']}>G</Header>
        <ButtonList alpha={'G'} strings={brandG} />

        <Header ref={scrollref.current['H']}>H</Header>
        <ButtonList alpha={'H'} strings={brandH} />

        <Header ref={scrollref.current['I']}>I</Header>
        <ButtonList alpha={'I'} strings={brandI} />

        <Header ref={scrollref.current['J']}>J</Header>
        <ButtonList alpha={'J'} strings={brandJ} />

        <Header ref={scrollref.current['K']}>K</Header>
        <ButtonList alpha={'K'} strings={brandK} />

        <Header ref={scrollref.current['L']}>L</Header>
        <ButtonList alpha={'L'} strings={brandL} />

        <Header ref={scrollref.current['M']}>M</Header>
        <ButtonList alpha={'M'} strings={brandM} />

        <Header ref={scrollref.current['N']}>N</Header>
        <ButtonList alpha={'N'} strings={brandN} />

        <Header ref={scrollref.current['O']}>O</Header>
        <ButtonList alpha={'O'} strings={brandO} />

        <Header ref={scrollref.current['P']}>P</Header>
        <ButtonList alpha={'P'} strings={brandP} />

        <Header ref={scrollref.current['Q']}>Q</Header>
        <ButtonList alpha={'Q'} strings={brandQ} />

        <Header ref={scrollref.current['R']}>R</Header>
        <ButtonList alpha={'R'} strings={brandR} />

        <Header ref={scrollref.current['S']}>S</Header>
        <ButtonList alpha={'S'} strings={brandS} />

        <Header ref={scrollref.current['T']}>T</Header>
        <ButtonList alpha={'T'} strings={brandT} />

        <Header ref={scrollref.current['U']}>U</Header>
        <ButtonList alpha={'U'} strings={brandU} />

        <Header ref={scrollref.current['V']}>V</Header>
        <ButtonList alpha={'V'} strings={brandV} />

        <Header ref={scrollref.current['W']}>W</Header>
        <ButtonList alpha={'W'} strings={brandW} />

        <Header ref={scrollref.current['X']}>X</Header>
        <ButtonList alpha={'X'} strings={brandX} />

        <Header ref={scrollref.current['Y']}>Y</Header>
        <ButtonList alpha={'Y'} strings={brandY} />

        <Header ref={scrollref.current['Z']}>Z</Header>
        <ButtonList alpha={'Z'} strings={brandZ} />

        <Header ref={scrollref.current['#']}>#</Header>
        <ButtonList alpha={'#'} strings={brandnumbers} />
      </Content>
    </Container>
  );
}

const ButtonList = ({ alpha, strings }) => {
  const navigate = useNavigate();
  const goto = (tag) => {
    navigate(`/brandpage/${tag}`);
  };
  return (
    <div className="div-list">
      {strings.map((string, index) => (
        <Link key={index} to={`/search?query=${string}`}>
          {string}
        </Link>
      ))}
      <div className="seemore" onClick={() => goto(alpha)}>
        See more...
      </div>
      <style jsx>{`
        .div-list {
          display: flex;
          flex-wrap: wrap;
        }
        .div-list a {
          width: 100%;
          text-align: left;
          text-transform: capitalize;
          padding: 10px;
          border-bottom: 1px solid #00000030;
        }
        .div-list a:hover {
          color: var(--orange-color);
        }
        .seemore {
          font-weight: bold;
          cursor: :pointer;
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
