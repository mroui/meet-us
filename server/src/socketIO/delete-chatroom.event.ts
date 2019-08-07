export const deleteChatroomHandler = (socket) => socket.on('chatroomDelete', function (chatroom) {
    const {chatId} = chatroom.id;
    const isUserInPassedChat = !!Object.keys(socket.rooms).includes(chatId);

    socket.to(isUserInPassedChat && chatId).emit("chatroomDelete", chatroom);
});