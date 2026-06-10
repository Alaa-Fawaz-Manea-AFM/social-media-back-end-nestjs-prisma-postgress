import axios from "axios";

export const DOMAIN: string = `${process.env.NEXT_PUBLIC_API_URL}`;

const AxiosClient = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

export default AxiosClient;
