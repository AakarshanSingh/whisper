import Conversation from '../models/ConversationSchema.js';
import Message from '../models/MessageSchema.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { v2 as cloudinary } from 'cloudinary';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    let { imgUrl } = req.body;

    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let image = false;
    const isSelfChat = senderId.toString() === receiverId.toString();
    let conversation = await Conversation.findOne({
      participants: isSelfChat ? [senderId] : { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: isSelfChat ? [senderId] : [senderId, receiverId],
      });
    }

    if (imgUrl) {
      image = true;
      let uploadedResponse = await cloudinary.uploader.upload(imgUrl, {
        folder: 'whisper',
      });
      imgUrl = uploadedResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || '',
      image,
      imgUrl: imgUrl || '',
      conversationId: conversation._id,
      messageType: image ? 'image' : 'text',
      textContent: message || '',
      imageUrl: imgUrl || '',
    });

    if (newMessage) {
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageAt = new Date();
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    await conversation.populate('participants', 'fullName profilePic username');

    const loggedInUserId = senderId;
    const otherParticipant = conversation.participants.find(
      (participant) => participant._id.toString() !== loggedInUserId.toString()
    );

    const formattedConversation = {
      _id: isSelfChat ? senderId : otherParticipant._id,
      fullName: isSelfChat ? req.user.fullName : otherParticipant.fullName,
      profilePic: isSelfChat
        ? req.user.profilePic
        : otherParticipant.profilePic,
      username: isSelfChat ? req.user.username : otherParticipant.username,
      lastMessage: message || '',
      lastMessageAt: conversation.lastMessageAt,
      conversationId: conversation._id,
    };

    if (!isSelfChat) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', {
          newMessage,
          conversation: formattedConversation,
        });
      }
    }

    res.status(201).json({ newMessage, conversation: formattedConversation });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const isSelfChat = senderId.toString() === userToChatId.toString();
    const conversation = await Conversation.findOne({
      participants: isSelfChat
        ? [senderId]
        : { $all: [senderId, userToChatId] },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    let messages = await Message.find({
      conversationId: conversation._id,
    })
      .populate('senderId', 'fullName profilePic')
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      if (isSelfChat) {
        messages = await Message.find({
          senderId,
          receiverId: senderId,
        })
          .populate('senderId', 'fullName profilePic')
          .sort({ createdAt: 1 });
      } else {
        messages = await Message.find({
          $or: [
            { senderId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: senderId },
          ],
        })
          .populate('senderId', 'fullName profilePic')
          .sort({ createdAt: 1 });
      }
    }

    const formattedMessages = messages.map((msg) => {
      const senderName =
        msg.senderId && typeof msg.senderId === 'object'
          ? msg.senderId.fullName
          : undefined;

      const messageObj = msg.toObject();
      if (senderName) {
        messageObj.senderName = senderName;

        if (msg.senderId.profilePic) {
          messageObj.senderProfilePic = msg.senderId.profilePic;
        }

        messageObj.senderId = msg.senderId._id;
      }

      if (!messageObj.message && messageObj.textContent) {
        messageObj.message = messageObj.textContent;
      }
      if (!messageObj.imgUrl && messageObj.imageUrl) {
        messageObj.imgUrl = messageObj.imageUrl;
      }
      if (!messageObj.image) {
        messageObj.image = messageObj.messageType === 'image';
      }

      return messageObj;
    });
    res.status(200).json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to get messages' });
  }
};
