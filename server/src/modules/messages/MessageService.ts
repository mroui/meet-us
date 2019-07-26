import {ModelType, Ref} from "typegoose";
import MessageModel, { Message } from "./MessageEntity";
import {User} from "../user/UserEntity";
import {ChatRoom} from '../chatrooms/ChatRoomEntity';

export class MessageService {
  private readonly model: ModelType<Message>;

  constructor() {
    this.model = MessageModel;
  }

  async find(selector?: Partial<Message>) {
    // DK: .populate("from") no longer needed, see @FieldResolver of from on MessageResolver
    return this.model.find(selector).exec();
  }

  async findOneById(_id: string) {
    return this.model.findOne({ _id });
  }

  async remove(_id: string) {
    let entityToRemove = await this.model.findOne(_id);
    await this.model.remove(entityToRemove);
  }

  async count(entity: any) {
    return this.model.count(entity);
  }

  async addMessage(from: Ref<User>, msg: String, chatroom: Ref<ChatRoom>, guestId: String, guestName: String) {
    return this.model.create({from, msg, chatroom, guestId, guestName}).then((createdMessage) => createdMessage)
  }
}
