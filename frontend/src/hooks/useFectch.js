import React, { useState, useEffect } from "react";
import axios from "axios";

function useFetch(query, pageNum) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setData([]);
  }, [query]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;

    setIsLoading(true);
    setError(false);

    axios
      .get(`/api/brands?q=${query}&page=${pageNum}`, {
        cancelToken: new CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setData((prev) => {
          return [...new Set([...prev, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err);
      });

    return () => cancel();
  }, [query, pageNum]);

  return { isLoading, error, data, hasMore };
}

export default useFetch;
