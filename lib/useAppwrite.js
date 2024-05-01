import { useEffect, useState } from "react";
import { Alert } from 'react-native';

const useAppwrite = (fn) => {
  const [data, setData] = useState([])
  const [isloading, setIsloading] = useState(false)

  const fetchdata = async () => {
    setIsloading(true)

    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      Alert.alert("Error" , error.message)
    } finally{
      setIsloading(false)
    }
  } 


  useEffect(() => { 
    fetchdata();
  }, []);

  const refetch = async () => fetchdata();

  return { data,isloading,refetch }
}


export default useAppwrite