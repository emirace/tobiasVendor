import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import LoadingBox from '../component/LoadingBox';
import Model from '../component/Model';
import { Store } from '../Store';
import { getError } from '../utils';

const Container = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px;
`;
const ImageCont = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProductDetail = styled.div`
  flex: 5;
`;
const Image = styled.img`
  width: 100%;
`;
const Upload = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  border: 1px dashed #575555;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  & svg {
    font-size: 35px;
  }
`;
const AddDots = styled.div`
  padding: 5px;
  cursor: pointer;
`;
const Camera = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;
const Input = styled.input`
  display: none;
`;
const Title = styled.h1`
  font-size: 28px;
`;
const ModelImg = styled.img`
  align-self: center;
  height: 100%;
`;
const ConImg = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;
const DotsWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const Add = styled.div`
  position: absolute;
  top: ${(props) => props.dot.y}%;
  left: ${(props) => props.dot.x}%;
  transform: translate(-50%, -50%);
  border: 1px solid;
  border-radius: 50%;
  background-color: var(--orange-color);
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 300;
  opacity: 6;
  cursor: pointer;
`;
const Pointers = styled.div`
  display: flex;
  margin: 20px 0;
`;
const Pointer = styled.div`
  margin: 15px;
  padding: 5px 20px;
  border: 1px solid;
  border-radius: 15px;
  cursor: pointer;
  &.active {
    background: ${(props) =>
      props.mode === 'pagebodydark'
        ? 'var(--white-color)'
        : 'var(--black-color)'};
    color: ${(props) =>
      props.mode === 'pagebodydark'
        ? 'var(--black-color)'
        : 'var(--white-color)'};
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };

    default:
      return state;
  }
};
const Dots = [];

export default function CreateOutfitPicScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [image, setImage] = useState('/images/card1.png');
  const [showModel, setShowModel] = useState(false);
  const [selectedPointer, setSelectedPointer] = useState();

  const ref = useRef(null);

  const [{ loading, error, loadingUpload, errorUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      loadingUpload: false,
      errorUpload: '',
    }
  );

  useEffect(() => {
    const currentRef = ref.current;
    console.log(currentRef);
    if (currentRef) {
      const clickListener = (e) => {
        const TopOfElement = currentRef.getBoundingClientRect().top;
        const BottomOfElement = currentRef.getBoundingClientRect().bottom;
        const leftOfElement = currentRef.getBoundingClientRect().left;
        const rightOfElement = currentRef.getBoundingClientRect().right;
        const mousePosXRelativeToElement = e?.clientX ?? 0;
        const mousePosYRelativeToElement = e?.clientY ?? 0;

        const fullWidth = rightOfElement - leftOfElement;
        const fullHeight = BottomOfElement - TopOfElement;

        const mousePosX = mousePosXRelativeToElement - leftOfElement;
        const mousePosY = mousePosYRelativeToElement - TopOfElement;
        const Xpercent = (mousePosX / fullWidth) * 100;
        const Ypercent = (mousePosY / fullHeight) * 100;
        console.log('mousePosition', Xpercent, Ypercent);
        Dots.push({ x: Xpercent, y: Ypercent });
      };
      currentRef.addEventListener('click', clickListener);
      return () => {
        currentRef.removeEventListener('click', clickListener);
      };
    }
  }, [showModel]);

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);

      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Image Uploaded',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Failed uploading image',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      console.log(getError(err));
    }
  };

  return (
    <Container>
      <ImageCont>
        {image ? (
          <>
            <DotsWrapper>
              {console.log(Dots)}
              <Image src={image} alt="outdits" />
              {Dots.length > 0 &&
                Dots.map((dot, i) => (
                  <Add key={i} dot={dot}>
                    +
                  </Add>
                ))}
            </DotsWrapper>
            <AddDots onClick={() => setShowModel(!showModel)}>
              Click Here To Add Pointer
            </AddDots>
            <Model showModel={showModel} setShowModel={setShowModel}>
              <ConImg>
                <ModelImg ref={ref} src={image} />
              </ConImg>
            </Model>
          </>
        ) : (
          <Upload mode={mode}>
            <Camera htmlFor="image1">
              <div>Upload Image</div>
              {loadingUpload ? (
                <LoadingBox />
              ) : (
                <FontAwesomeIcon icon={faCamera} />
              )}
              <Input
                type="file"
                id="image1"
                onChange={(e) => uploadHandler(e)}
              />
            </Camera>
          </Upload>
        )}
      </ImageCont>
      <ProductDetail>
        <Title>NewProduct</Title>
        <Pointers>
          {Dots.length > 0 &&
            Dots.map((dot, i) => (
              <Pointer
                key={i}
                className={selectedPointer === i ? 'active' : ''}
                mode={mode}
                onClick={() => setSelectedPointer(i)}
              >
                Pointer {1 + i}
              </Pointer>
            ))}
        </Pointers>
      </ProductDetail>
    </Container>
  );
}
