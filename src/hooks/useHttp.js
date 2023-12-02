import { useCallback, useState } from "react";
import axios from "axios";
const useHttp = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (configs) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(configs.url);
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);
  return { data, loading, error, get,setData };
};

export default useHttp;