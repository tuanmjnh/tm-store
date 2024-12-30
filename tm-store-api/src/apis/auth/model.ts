import { IUser } from "../users/model"

export interface IUserAuth extends IUser  {
  routes:Array<string>
}
