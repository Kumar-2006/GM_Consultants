import { useEffect, useState } from "react";

const animationCache = new Map();

const useLottieAnimation = (url) => {
  const [data, setData] = useState(() =>
    url && animationCache.has(url) ? animationCache.get(url) : null,
  );

  useEffect(() => {
    let active = true;

    if (!url) {
      setData(null);
      return undefined;
    }

    if (animationCache.has(url)) {
      setData(animationCache.get(url));
      return undefined;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (!active) {
          return;
        }
        animationCache.set(url, json);
        setData(json);
      })
      .catch(() => {
        if (active) {
          setData(null);
        }
      });

    return () => {
      active = false;
    };
  }, [url]);

  return data;
};

export default useLottieAnimation;
