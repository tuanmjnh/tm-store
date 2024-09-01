import { IUser } from '@apis/users/model';

export interface IUserAuth extends IUser {
  routes: Array<string>
}
