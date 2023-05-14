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
import { faArrowUp, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    font-size: 15px;
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
  padding-right: 10px;
  padding-left: 10px;
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
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
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

const ScrollToTop = styled.div`
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 40px;
  height: 40px;
  z-index: 9;
  border-radius: 50%;
  background: ${(props) =>
    props.mode === 'pagebodylight' ? 'black' : 'white'};
  display: flex;
  justify-content: center;
  color: black;
  cursor: pointer;
  align-items: center;
  & svg {
    font-size: 20px;
    color: var(--orange-color);
  }
  /* @media (max-width: 992px) {
    bottom: 65px;
  } */
`;

var headerList = [];

export default function BrandScreen() {
  const { state } = useContext(Store);
  const { mode } = state;

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  // const brandArray = Brands.split("\n");

  const scrollref = useRef(['#', ...alphabet].map(React.createRef));

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

  const [searchBrand, setSearchBrand] = useState(null);
  useEffect(() => {
    const getSearch = async () => {
      if (!query) {
        setSearchBrand([]);
        return;
      }
      const { data } = await axios.get(`/api/brands/search?q=${query}`);
      console.log(data);
      query && setSearchBrand(data);
    };
    getSearch();
  }, [query]);

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

  const scrollToAlpha = (i) => {
    console.log('scrollToAlpha', i, scrollref.current[i]);
    return (
      scrollref.current[i].current &&
      window.scrollTo({
        top: scrollref.current[i].current.offsetTop,
        behavior: 'smooth',
      })
    );
  };
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
        <Header mode={mode} ref={scrollref.current[headerList.length]}>
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
          <button
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 0,
              color:
                mode === 'pagebodydark'
                  ? 'var(--white-color)'
                  : 'var(--black-color)',
            }}
            key={i}
            onClick={() => {
              scrollToAlpha(i);
              console.log(i);
            }}
          >
            <Alpha>{x}</Alpha>
          </button>
        ))}
      </AlphaGroup>
      <Search>
        <SearchInput
          mode={mode}
          onChange={handleChange}
          placeholder="Search brands"
        />
        <SearchContainer mode={mode}>
          {query &&
            searchBrand &&
            searchBrand.map((brand) => (
              <Link to={`/Search?brand=${brand.name}`}>
                <SearchData mode={mode}>{brand.name}</SearchData>
              </Link>
            ))}
        </SearchContainer>
      </Search>

      <Content>
        {/* {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ...alphabet].map(
          (x, i) => (
            <div key={i}>
              <Header mode={mode} ref={scrollref.current[i]} mode={mode}>
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

        <Header mode={mode} ref={scrollref.current['1']}>
          A
        </Header>
        <ButtonList alpha={'A'} strings={brandA} />

        <Header mode={mode} ref={scrollref.current['2']}>
          B
        </Header>
        <ButtonList alpha={'B'} strings={brandB} />

        <Header mode={mode} ref={scrollref.current['3']}>
          C
        </Header>
        <ButtonList alpha={'C'} strings={brandC} />

        <Header mode={mode} ref={scrollref.current['4']}>
          D
        </Header>
        <ButtonList alpha={'D'} strings={brandD} />

        <Header mode={mode} ref={scrollref.current['5']}>
          E
        </Header>
        <ButtonList alpha={'E'} strings={brandE} />

        <Header mode={mode} ref={scrollref.current['6']}>
          F
        </Header>
        <ButtonList alpha={'F'} strings={brandF} />

        <Header mode={mode} ref={scrollref.current['7']}>
          G
        </Header>
        <ButtonList alpha={'G'} strings={brandG} />

        <Header mode={mode} ref={scrollref.current['8']}>
          H
        </Header>
        <ButtonList alpha={'H'} strings={brandH} />

        <Header mode={mode} ref={scrollref.current['9']}>
          I
        </Header>
        <ButtonList alpha={'I'} strings={brandI} />

        <Header mode={mode} ref={scrollref.current['10']}>
          J
        </Header>
        <ButtonList alpha={'J'} strings={brandJ} />

        <Header mode={mode} ref={scrollref.current['11']}>
          K
        </Header>
        <ButtonList alpha={'K'} strings={brandK} />

        <Header mode={mode} ref={scrollref.current['12']}>
          L
        </Header>
        <ButtonList alpha={'L'} strings={brandL} />

        <Header mode={mode} ref={scrollref.current['13']}>
          M
        </Header>
        <ButtonList alpha={'M'} strings={brandM} />

        <Header mode={mode} ref={scrollref.current['14']}>
          N
        </Header>
        <ButtonList alpha={'N'} strings={brandN} />

        <Header mode={mode} ref={scrollref.current['15']}>
          O
        </Header>
        <ButtonList alpha={'O'} strings={brandO} />

        <Header mode={mode} ref={scrollref.current['16']}>
          P
        </Header>
        <ButtonList alpha={'P'} strings={brandP} />

        <Header mode={mode} ref={scrollref.current['17']}>
          Q
        </Header>
        <ButtonList alpha={'Q'} strings={brandQ} />

        <Header mode={mode} ref={scrollref.current['18']}>
          R
        </Header>
        <ButtonList alpha={'R'} strings={brandR} />

        <Header mode={mode} ref={scrollref.current['19']}>
          S
        </Header>
        <ButtonList alpha={'S'} strings={brandS} />

        <Header mode={mode} ref={scrollref.current['20']}>
          T
        </Header>
        <ButtonList alpha={'T'} strings={brandT} />

        <Header mode={mode} ref={scrollref.current['21']}>
          U
        </Header>
        <ButtonList alpha={'U'} strings={brandU} />

        <Header mode={mode} ref={scrollref.current['22']}>
          V
        </Header>
        <ButtonList alpha={'V'} strings={brandV} />

        <Header mode={mode} ref={scrollref.current['23']}>
          W
        </Header>
        <ButtonList alpha={'W'} strings={brandW} />

        <Header mode={mode} ref={scrollref.current['24']}>
          X
        </Header>
        <ButtonList alpha={'X'} strings={brandX} />

        <Header mode={mode} ref={scrollref.current['25']}>
          Y
        </Header>
        <ButtonList alpha={'Y'} strings={brandY} />

        <Header mode={mode} ref={scrollref.current['26']}>
          Z
        </Header>
        <ButtonList alpha={'Z'} strings={brandZ} />

        <Header mode={mode} ref={scrollref.current['0']}>
          #
        </Header>
        <ButtonList alpha={'other'} strings={brandnumbers} />
      </Content>
      <ScrollToTop mode={mode}>
        <FontAwesomeIcon
          onClick={() => window.scrollTo(0, 0)}
          icon={faArrowUp}
        />
      </ScrollToTop>
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
          cursor: pointer;
          padding-top: 10px;
          color: var(--orange-color);
        }
        @media (min-width: 768px) {
          .div-list a {
            width: 33.33%;
            padding: 5px 24px;
            border-bottom: 0;
          }

          .seemore {
            padding: 5px 24px;
          }
        }
      `}</style>
    </div>
  );
};
