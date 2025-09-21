import {io} from "socket.io-client";
import { backendUrl } from "../constantApi";
const socket=io(`${backendUrl}`,{
    withCredentials:true,
});

export default socket;