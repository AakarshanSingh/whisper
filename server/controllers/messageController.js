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
    }).populate({
      path: 'messages',
      populate: {
        path: 'senderId',
        select: 'fullName profilePic' // Get sender's name and profile picture
      }
    });

    if (conversation === null) {
      // Return an empty array when there's no conversation to prevent "not iterable" errors
      return res.status(200).json([]);
    }
    
    // Format messages to include sender name for avatars
    const formattedMessages = conversation.messages.map(msg => {
      // If the message has sender info populated, extract the name
      const senderName = msg.senderId && typeof msg.senderId === 'object' ? 
        msg.senderId.fullName : undefined;
      
      // Convert to plain object and add senderName
      const messageObj = msg.toObject();
      if (senderName) {
        messageObj.senderName = senderName;
        // If senderId is an object with profilePic, save it as senderProfilePic
        if (msg.senderId.profilePic) {
          messageObj.senderProfilePic = msg.senderId.profilePic;
        }
        // Convert senderId back to string ID for consistency
        messageObj.senderId = msg.senderId._id;
      }
      
      return messageObj;
    });

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: error.message || "Failed to get messages" });
  }
};
