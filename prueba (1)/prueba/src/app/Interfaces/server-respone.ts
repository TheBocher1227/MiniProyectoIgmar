import { Category } from "./category";

export interface ServerResponse {
    msg: string;
    'data :'?: Category[];
  }
  