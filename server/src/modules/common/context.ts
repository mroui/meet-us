import { User } from '../user/UserEntity'
import {Ref} from "typegoose";

export interface Context {
  userId?: Ref<User>
  user?: User
}
