import { createContext, Dispatch, SetStateAction } from "react";

export interface LoadingType {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingAPI = createContext<LoadingType>({} as LoadingType);

export default LoadingAPI;
