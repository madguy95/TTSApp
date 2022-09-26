import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { Api, ApiDefault } from "../model/api";

const ReferenceDataContext = createContext({
    data: ApiDefault, 
    setData: (data: Api) => {}
});

function ReferenceDataContextProvider(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  const [data, setData] = React.useState<Api>(ApiDefault);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const idStr = await AsyncStorage.getItem("active");
      if (idStr != undefined && !isNaN(+idStr)) {
        let id = Number(idStr);
        const jsonValue = await AsyncStorage.getItem("configs");
        let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : {};
        setData(jsonObj[id]);
      }
    } catch (e) {
      console.log('[ReferenceDataContext] loadData: ' + e);
    }
  };

  return (
    <ReferenceDataContext.Provider value={{ data, setData }}>
      {props.children}
    </ReferenceDataContext.Provider>
  );
}

export { ReferenceDataContext, ReferenceDataContextProvider };
