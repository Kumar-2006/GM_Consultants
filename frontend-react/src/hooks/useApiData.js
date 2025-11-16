import { useEffect, useState } from "react";

const useApiData = (fetcher, options = {}) => {
  const { immediate = true, params = [] } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!immediate) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetcher(...params);
        if (!cancelled) {
          setData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [fetcher, immediate, params]);

  return { data, setData, loading, error };
};

export default useApiData;
