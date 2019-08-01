import {ModelType, Ref} from "typegoose";
import ChatRoomModel, { ChatRoom } from "./ChatRoomEntity";
import {User} from "../user/UserEntity";

export class ChatRoomService {
  private readonly model: ModelType<ChatRoom>;

  constructor() {
    this.model = ChatRoomModel;
  }

  async find(selector?: Partial<ChatRoom>) {
    return this.model.find(selector);
  }

  async findOneById(_id: string) {
    return this.model.findOne({ _id }).populate("users").exec();
  }

  async remove(_id: string) {
    let entityToRemove = await this.model.findOne(_id);
    await this.model.remove(entityToRemove);
  }

  async count(entity: any) {
    return this.model.count(entity);
  }

  async createNewChatroom(chatroom: Partial<ChatRoom>, ownerId: Ref<User>) {
    const finalChatroom = {...chatroom, owner: ownerId, users: ownerId};
    console.log(`finalChatroom: `, finalChatroom);
    return this.model.create(finalChatroom)
        .then((createdChatroom) => createdChatroom._id)
  }

  async joinToChatroom(chatroomId: String, user: Ref<User>) {
    return this.model.findByIdAndUpdate(chatroomId, {$addToSet: {users: user}}, {new: true}).populate("users").exec();
  }

  async updateActivityChatroom(chatroom: Partial<ChatRoom>, chatroomId: String) {
    return this.model.findByIdAndUpdate(chatroomId, chatroom, {new: true}).exec();
  }
}
