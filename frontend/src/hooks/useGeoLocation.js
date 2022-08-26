import axios from "axios";
import React, { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: {
      lat: "",
      lng: "",
    },
  });

  const onSuccess = async (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };
  const onError = (error) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
}
