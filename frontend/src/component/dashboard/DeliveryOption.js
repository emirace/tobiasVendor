import {
  faCheck,
  faQuestionCircle,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../../Store';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getError, loginGig, region } from '../../utils';
import axios from 'axios';
import useGeoLocation from '../../hooks/useGeoLocation';
import LoadingBox from '../LoadingBox';

const Container = styled.div`
  padding: 30px 15vw;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 10px;
  }
`;
const Title = styled.h1`
  font-size: 28px;
`;
const TitleDetails = styled.span`
  width: 70%;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 10px;
`;

const Option = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
`;
const Name = styled.div``;

const Switch = styled.input.attrs({
  type: 'checkbox',
  id: 'darkmodeSwitch',
  role: 'switch',
})`
  position: relative;

  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #d4d4d4;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
  }

  &:checked {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : '#fcf0e0'};
    &:before {
      left: 25px;
      background: var(--orange-color);
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: grey;
    transition: 0.5s;
  }
`;

const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: '${(props) => props.tips}';
    width: 350px;
    position: absolute;
    border-radius: 0.5rem;
    left: 30px;
    text-align: justify;
    font-size: 14px;
    z-index: 2;
    line-height: 1.2;
    font-weight: 400;
    padding: 10px;
    background: ${(props) =>
      props.mode === 'pagebodydark'
        ? 'var(--white-color)'
        : 'var(--black-color)'};
    color: ${(props) =>
      props.mode === 'pagebodydark'
        ? 'var(--black-color)'
        : 'var(--white-color)'};
    @media (max-width: 992px) {
      font-size: 11px;
      left: -90px;
      top: 20px;
      width: 200px;
    }
  }
  & svg {
    margin-left: 10px;
    color: #d4d4d4;
  }
`;
const OptionCont = styled.div`
  margin: 10px 0;
`;
const Plans = styled.div`
  & a {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const Plan = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  justify-content: space-between;
`;

const Plan1 = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  justify-content: space-between;
  padding: 10px 30px;
`;
const PlanName = styled.div`
  font-size: 14px;
`;

const Radio = styled.input`
  &:checked::after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: var(--orange-color);
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
  }
`;

const Input = styled.input`
  border: none;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
  background: none;
  padding-left: 10px;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  &:focus {
    outline: none;
    border-bottom: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 14px;
  }
`;

const Button = styled.div`
  padding: 5px 7px;
  cursor: pointer;
  color: white;
  text-align: center;
  background: var(--orange-color);
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_STATIONs_REQUEST':
      return { ...state, loadingStations: true };
    case 'FETCH_STATIONs_SUCCESS':
      return {
        ...state,
        loadingStations: false,
        stations: action.payload,
        error: '',
      };

    case 'FETCH_STATIONs_FAILED':
      return { ...state, loadingStations: false };

    default:
      return state;
  }
};

export default function DeliveryOption({
  setDeliveryOption,
  deliveryOption,
  setShowModel,
  paxi,
  setPaxi,
  setGig,
  gig,
  pudo,
  setPudo,
  postnet,
  setPostnet,
  aramex,
  setAramex,
  pickup,
  setPickup,
  bundle,
  setBundle,
  meta,
  setMeta,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [error1, setError1] = useState('');

  const handleChange = (e) => {
    const { name, value } = e;
    const exist = deliveryOption.filter((x) => x.name === name);
    if (e.gig) {
      if (location.error) {
        console.log(location);
        return;
      } else {
        setMeta({
          ...meta,
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        });
      }
    }
    console.log('meta', meta);

    if (exist) {
      const newArray = deliveryOption.filter((x) => x.name !== name);
      setDeliveryOption([...newArray, { name, value }]);
    } else {
      setDeliveryOption((prevstate) => [...prevstate, { name, value }]);
    }
  };

  const [{ error, loadingStations, stations }, dispatch] = useReducer(reducer, {
    error: '',
    loadingStations: true,
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        dispatch({ type: 'FETCH_STATIONs_REQUEST' });
        const token = await loginGig();
        console.log(token);
        const { data } = await axios.get(
          'https://thirdparty.gigl-go.com/api/thirdparty/localStations',
          {
            headers: { Authorization: `Bearer ${token.token}` },
          }
        );
        console.log(data);
        dispatch({ type: 'FETCH_STATIONs_SUCCESS', payload: data.Object });
      } catch (error) {
        dispatch({ type: 'FETCH_STATIONs_FAIL' });
      }
    };
    fetchStations();
  }, []);

  const location = useGeoLocation();
  const [locationerror, setLocationerror] = useState('');
  useEffect(() => {
    if (gig) {
      if (location.error) {
        setLocationerror('Location is require for proper delivery');
      } else {
        setMeta({
          ...meta,
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        });
      }
    }
  }, [gig, location]);

  const handleCheck = (e) => {
    const { name, value } = e;
    console.log('hello', name, value);

    const exist = deliveryOption.filter((x) => x.value === value);
    console.log('exist', exist);
    if (exist) {
      return true;
    } else {
      return false;
    }
  };
  const [rebundleStatus, setRebundleStatus] = useState('');
  const [rebundleCount, setRebundleCount] = useState(0);
  const [loadingRebundle, setLoadingRebundle] = useState(false);
  const [rebundleError, setRebundleError] = useState('');

  const handleRebundle = async (value) => {
    if (value) {
      const { data } = await axios.put('/api/users/bundle', value, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setBundle(data.status);
      return;
    }
    if (!rebundleCount) {
      setRebundleError('Enter the quantity of item(s) for Rebundle');
      return;
    }
    try {
      setLoadingRebundle(true);
      const { data } = await axios.put(
        '/api/users/bundle',
        { status: rebundleStatus, count: rebundleCount },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setBundle(data.status);
      setLoadingRebundle(false);
    } catch (err) {
      setLoadingRebundle(false);
      console.log(getError(err));
    }
  };

  const handleClose = () => {
    if (rebundleStatus & !bundle) {
      setRebundleError('Click activate to make Rebundle active ');
      return;
    }

    if (paxi) {
      const exist = deliveryOption.filter((x) => x.name === 'Paxi PEP store');
      if (exist.length === 0) {
        setError1('Select a delivery price option for Paxi PEP store ');
        return;
      }
    }
    if (pudo) {
      const exist = deliveryOption.filter(
        (x) => x.name === 'PUDO Locker-to-Locker'
      );
      if (exist.length === 0) {
        setError1('Select a delivery price option for PUDO Locker-to-Locker ');
        return;
      }
    }

    if (postnet) {
      const exist = deliveryOption.filter(
        (x) => x.name === 'PostNet-to-PostNet'
      );
      if (exist.length === 0) {
        setError1('Select a delivery price option for PostNet-to-PostNet ');
        return;
      }
    }
    if (aramex) {
      const exist = deliveryOption.filter(
        (x) => x.name === 'Aramex Store-to-Door'
      );
      if (exist.length === 0) {
        setError1('Select a delivery price option for Aramex Store-to-Door ');
        return;
      }
    }

    if (gig) {
      if (!meta.name) {
        setError1('Enter a valid name');
        return;
      }
      if (!meta.address) {
        setError1('Enter a valid address');
        return;
      }
      if (!meta.phone) {
        setError1('Enter a valid phone');
        return;
      }
      if (!meta.stationId) {
        setError1('Select station');
        return;
      }
    }

    setShowModel(false);
  };
  return (
    <Container>
      <Title>Delivery</Title>
      <TitleDetails>
        Select as many as you like. Shops with multiple options sell faster. The
        Buyer will cover the delivery fee when purchasing.
      </TitleDetails>
      {region() === 'ZAR' ? (
        <>
          <OptionCont>
            <Option>
              <Label>
                <FontAwesomeIcon icon={faTruck} />
                <Name>Paxi PEP store</Name>
                <Tips
                  mode={mode}
                  tips={`Store-to-store courier service anywhere in South Africa. Drop off the item at the nearest PEP store / PAXI collection point. The Buyer will collect the item from the pick-up point of their choice.
                      `}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <Switch
                mode={mode}
                checked={paxi}
                onChange={(e) => {
                  setPaxi(e.target.checked);
                  if (!e.target.checked) {
                    setDeliveryOption(
                      deliveryOption.filter((x) => x.name !== 'Paxi PEP store')
                    );
                  }
                }}
              ></Switch>
            </Option>
            <div
              style={{ width: '100%', height: '1px', background: '#d4d4d4' }}
            />
            {paxi && (
              <Plans>
                <Plan>
                  <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
                  <Radio
                    type="radio"
                    name="Paxi PEP store"
                    onChange={(e) => handleChange(e.target)}
                    id="free"
                    value={0}
                  />
                </Plan>
                <Plan>
                  <PlanName>Standard parcel (450x370 mm) + R 59.95</PlanName>
                  <Radio
                    type="radio"
                    name="Paxi PEP store"
                    onChange={(e) => handleChange(e.target)}
                    value={59.95}
                    id="standard"
                  />
                </Plan>
                <Plan>
                  <PlanName>Large parcel (640x510 mm) + R 99.95</PlanName>
                  <Radio
                    type="radio"
                    name="Paxi PEP store"
                    onChange={(e) => handleChange(e.target)}
                    value={99.95}
                    id="Large"
                  />
                </Plan>
                <a
                  className="link"
                  href="https://www.paxi.co.za/#send-a-parcel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How PAXI works
                </a>
              </Plans>
            )}
          </OptionCont>
          <OptionCont>
            <Option>
              <Label>
                <FontAwesomeIcon icon={faTruck} />
                <Name>PUDO Locker-to-Locker</Name>
                <Tips
                  mode={mode}
                  tips={`
              Locker-to-locker courier service anywhere in South Africa. Drop off the item at the nearest Pudo locker. The Buyer will collect the item from the locker of their choice. Pudo lockers are accessible 24/7, so you can drop off or pick up your package when it suits you best.
                      `}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <Switch
                mode={mode}
                checked={pudo}
                onChange={(e) => {
                  setPudo(e.target.checked);
                  if (!e.target.checked) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== 'PUDO Locker-to-Locker'
                      )
                    );
                  }
                }}
              ></Switch>
            </Option>
            <div
              style={{ width: '100%', height: '1px', background: '#d4d4d4' }}
            />
            {pudo && (
              <Plans>
                <Plan>
                  <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    id="free"
                    value={0}
                  />
                </Plan>
                <Plan>
                  <PlanName>Extra-Small (600x170x80 mm) + R 40.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    value={40}
                    id="standard"
                  />
                </Plan>
                <Plan>
                  <PlanName>Small (600x410x80 mm) + R 50.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    value={50}
                    id="Large"
                  />
                </Plan>
                <Plan>
                  <PlanName>Medium (600x410x190 mm) + R 50.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    value={50}
                    id="Large"
                  />
                </Plan>
                <Plan>
                  <PlanName>Large (600x410x410 mm) + R 50.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    value={50}
                    id="Large"
                  />
                </Plan>
                <Plan>
                  <PlanName>Extra-Large (600x410x690 mm) + R 50.00</PlanName>
                  <Radio
                    type="radio"
                    name="PUDO Locker-to-Locker"
                    onChange={(e) => handleChange(e.target)}
                    value={50}
                    id="Large"
                  />
                </Plan>
                <a
                  className="link"
                  href="https://www.pudo.co.za/how-it-works.php"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How PUDO works
                </a>
              </Plans>
            )}
          </OptionCont>
          <OptionCont>
            <Option>
              <Label>
                <FontAwesomeIcon icon={faTruck} />
                <Name>PostNet-to-PostNet</Name>
                <Tips
                  mode={mode}
                  tips={`
              PostNet-to-PostNet courier service anywhere in South Africa. Drop off the item at the nearest PostNet counter. The Buyer will collect the item from the pick-up point of their choice. Your parcel will be delivered within 2-4 working days.
                      `}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <Switch
                mode={mode}
                checked={postnet}
                onChange={(e) => {
                  setPostnet(e.target.checked);
                  if (!e.target.checked) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== 'PostNet-to-PostNet'
                      )
                    );
                  }
                }}
              ></Switch>
            </Option>
            <div
              style={{ width: '100%', height: '1px', background: '#d4d4d4' }}
            />
            {postnet && (
              <Plans>
                <Plan>
                  <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
                  <Radio
                    type="radio"
                    name="PostNet-to-PostNet"
                    onChange={(e) => handleChange(e.target)}
                    id="free"
                    value={0}
                  />
                </Plan>
                <Plan>
                  <PlanName>Standard parcel (up to 2kg) + R 99</PlanName>
                  <Radio
                    type="radio"
                    name="PostNet-to-PostNet"
                    onChange={(e) => handleChange(e.target)}
                    value={99.99}
                    id="standard"
                  />
                </Plan>
                <Plan>
                  <PlanName>Standard parcel (up to 5kg) + R 109</PlanName>
                  <Radio
                    type="radio"
                    name="PostNet-to-PostNet"
                    onChange={(e) => handleChange(e.target)}
                    value={99.99}
                    id="standard"
                  />
                </Plan>
                <a
                  className="link"
                  href="https://www.postnet.co.za/domestic-postnet2postnet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How Postnet works
                </a>
              </Plans>
            )}
          </OptionCont>
          <OptionCont>
            <Option>
              <Label>
                <FontAwesomeIcon icon={faTruck} />
                <Name>Aramex Store-to-Door</Name>
                <Tips
                  mode={mode}
                  tips={`
              Store-to-door courier service anywhere in South Africa. Aramex shipment sleeves can be bought at kiosks, selected Pick n Pay and Freshstop stores nationwide. The parcel will be delivered to buyer’s door.        `}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <Switch
                mode={mode}
                checked={aramex}
                onChange={(e) => {
                  setAramex(e.target.checked);
                  if (!e.target.checked) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== 'Aramex Store-to-Door'
                      )
                    );
                  }
                }}
              ></Switch>
            </Option>
            <div
              style={{ width: '100%', height: '1px', background: '#d4d4d4' }}
            />
            {aramex && (
              <Plans>
                <Plan>
                  <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
                  <Radio
                    type="radio"
                    name="Aramex Store-to-Door"
                    onChange={(e) => handleChange(e.target)}
                    id="free"
                    value={0}
                  />
                </Plan>
                <Plan>
                  <PlanName>Standard parcel (350x450 mm) + R 99.99</PlanName>
                  <Radio
                    type="radio"
                    name="Aramex Store-to-Door"
                    onChange={(e) => handleChange(e.target)}
                    value={99.99}
                    id="standard"
                  />
                </Plan>
                <a
                  className="link"
                  href="https://www.youtube.com/watch?v=VlUQTF064y8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How Aramex works
                </a>
              </Plans>
            )}
          </OptionCont>
        </>
      ) : (
        <>
          <OptionCont>
            <Option>
              <Label>
                <FontAwesomeIcon icon={faTruck} />
                <Name>GIG Logistics</Name>
                <Tips
                  mode={mode}
                  tips={`Sending & receiving package almost anywhere in Nigeria is made easy with GIGL integrated on Repeddle. Simply fill in a contactable correct address and phone number. A GIGL driver may come to you for pick up, or ask you to drop off your package to the nearest GIGL experience centre closer to you. The buyer pays for delivery and package will be delivered to the address buyer will provide when making a purchase. Please do not make any delivery payment to anyone.`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <Switch
                mode={mode}
                checked={gig}
                onChange={(e) => {
                  setGig(e.target.checked);
                  handleChange({
                    name: 'GIG Logistics',
                    value: 0,
                    gig: e.target.checked,
                  });
                  if (!e.target.checked) {
                    setDeliveryOption(
                      deliveryOption.filter((x) => x.name !== 'GIG Logistics')
                    );
                  }
                }}
              ></Switch>
            </Option>
            <div
              style={{ width: '100%', height: '1px', background: '#d4d4d4' }}
            />
            {gig && (
              <Plans>
                {locationerror && (
                  <div style={{ color: 'red', textAlign: 'center' }}>
                    {locationerror}
                  </div>
                )}
                <Plan1>
                  <Input
                    mode={mode}
                    type="text"
                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                    placeholder="Name"
                    value={meta?.name}
                  />
                </Plan1>
                <Plan1>
                  <Input
                    mode={mode}
                    type="text"
                    onChange={(e) =>
                      setMeta({ ...meta, address: e.target.value })
                    }
                    placeholder="Address"
                    value={meta?.address}
                  />
                </Plan1>
                <Plan1>
                  <Input
                    mode={mode}
                    type="text"
                    onChange={(e) =>
                      setMeta({ ...meta, phone: e.target.value })
                    }
                    placeholder="Phone"
                    value={meta?.phone}
                  />
                </Plan1>
                <Plan1>
                  <div
                    style={{
                      fontSize: '14px',
                      marginLeft: '20px',
                      marginRight: '20px',
                      color: 'grey',
                    }}
                  >
                    Select Station
                  </div>
                  <FormControl
                    sx={{
                      width: '80%',
                      margin: 0,
                      borderRadius: '0.2rem',
                      border: `1px solid ${
                        mode === 'pagebodydark'
                          ? 'var(--dark-ev4)'
                          : 'var(--light-ev4)'
                      }`,
                      '& .MuiOutlinedInput-root': {
                        color: `${
                          mode === 'pagebodydark'
                            ? 'var(--white-color)'
                            : 'var(--black-color)'
                        }`,
                        '&:hover': {
                          outline: 'none',
                          border: 0,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '0 !important',
                      },
                    }}
                    size="small"
                  >
                    <Select
                      onChange={(e) =>
                        setMeta({ ...meta, stationId: e.target.value })
                      }
                      displayEmpty
                    >
                      {loadingStations ? (
                        <MenuItem value="">Loading...</MenuItem>
                      ) : (
                        stations.map((station) => (
                          <MenuItem value={station.StationId}>
                            {station.StateName}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Plan1>
                <a
                  className="link"
                  href="https://giglogistics.com/faqs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How GIG works
                </a>
              </Plans>
            )}
          </OptionCont>
        </>
      )}
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Pick up from Seller</Name>{' '}
            <Tips
              mode={mode}
              tips={`Pick-up from seller is an option seller & buyer agrees upon a choice of delivery outside of delivery methods available on Repeddle. Pick-up from seller may be ideal for users within the same locality.`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={pickup}
            onChange={(e) => {
              setPickup(e.target.checked);
              handleChange({ name: 'Pick up from Seller', value: '0' });
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter((x) => x.name !== 'Pick up from Seller')
                );
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: '100%', height: '1px', background: '#d4d4d4' }} />
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Re:Bundle</Name>
            <Tips
              mode={mode}
              tips={`
              Re:bundle allows buyers to shop multiple items from your store and only pay for delivery once! The buyer will be charged delivery on their first purchase, and, if they make any additional purchases within the next 2 hours, free delivery will then automatically apply. Shops who enable bundling sell more and faster.       `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={rebundleStatus}
            onChange={(e) => {
              if (e.target.checked) {
                setRebundleStatus(e.target.checked);
              } else {
                setRebundleStatus(e.target.checked);
                handleRebundle({ status: false, count: 0 });
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: '100%', height: '1px', background: '#d4d4d4' }} />
        {rebundleStatus && (
          <Plans>
            {bundle ? (
              <div>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: 'var(--orange-color)' }}
                />
              </div>
            ) : (
              <>
                <div style={{ fontWeight: '11px' }}>
                  Please input numbers of how many item(s) you are willing to
                  pack in delivery bag(s) for a buyer when Rebundle is active
                </div>
                <Plan>
                  <Input
                    mode={mode}
                    type="number"
                    onChange={(e) => {
                      setRebundleCount(e.target.value);
                    }}
                    onFocus={() => setRebundleError('')}
                  />
                  {loadingRebundle ? (
                    <LoadingBox />
                  ) : (
                    <Button onClick={() => handleRebundle(null)}>
                      Activate
                    </Button>
                  )}
                </Plan>
                {rebundleError && (
                  <div style={{ color: 'red' }}>{rebundleError}</div>
                )}
              </>
            )}
            <Link to="/rebundle" target="_blank">
              More on Re:bundle
            </Link>
          </Plans>
        )}
      </OptionCont>
      {error1 && <div style={{ color: 'red' }}>{error1}</div>}
      <Button onClick={handleClose}>Continue</Button>
    </Container>
  );
}
