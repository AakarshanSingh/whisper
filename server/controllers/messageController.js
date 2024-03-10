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

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
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
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');

    if (conversation === null) {
      return res.status(200).json({ message: 'Search to chat with someone' });
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
