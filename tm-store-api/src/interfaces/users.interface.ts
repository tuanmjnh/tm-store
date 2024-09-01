import { Types } from "mongoose";

export interface User {
  _id?: string;
  email: string;
  password: string;
}
