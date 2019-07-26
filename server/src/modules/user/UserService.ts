import { ModelType } from 'typegoose'
import UserModel, { User } from './UserEntity'
import {Ref} from "typegoose";

export class UserService {
  private readonly model: ModelType<User>

  constructor() {
    this.model = UserModel
  }

  async find(selector?: Partial<User>) {
    console.log('find selector: ', selector);
    return this.model.find(selector)
  }

  async findOneById(_id: Ref<User>) {
    console.log('findOneById _id: ', _id);
    return this.model.findOne({ _id })
  }

  async remove(_id: Ref<User>) {
    let entityToRemove = await this.model.findOne(_id)
    await this.model.remove(entityToRemove)
  }

  async count(entity: any) {
    return this.model.count(entity)
  }
}
