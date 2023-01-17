import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect} from 'react';
import {ApiDefault} from '@root/constants';
import {Api} from '@root/model/api';

const ReferenceDataContext = createContext({
  data: ApiDefault,
  setData: (data: Api) => {},
});

function ReferenceDataContextProvider(props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  const [data, setData] = React.useState<Api>(ApiDefault);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const code = await AsyncStorage.getItem('active_code');
      if (code) {
        const jsonValue = await AsyncStorage.getItem(code);
        let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (jsonObj) {
          setData(jsonObj);
        }
      }
    } catch (e) {
      console.log('[ReferenceDataContext] loadData: ' + e);
    }
  };

  return (
    <ReferenceDataContext.Provider value={{data, setData}}>
      {props.children}
    </ReferenceDataContext.Provider>
  );
}

export {ReferenceDataContext, ReferenceDataContextProvider};
