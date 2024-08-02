import { HOST } from "@/utiles/contants";
import axios from "axios";




export const apiClient = axios.create({
  baseURL:HOST
})

