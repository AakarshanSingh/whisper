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
    let image = false;    // Handle self-chat (saved messages)
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
    }    const newMessage = new Message({
      // Old schema fields (required for current database)
      senderId,
      receiverId,
      message: message || '',
      image,
      imgUrl: imgUrl || '',
      // New schema fields (for future migration)
      conversationId: conversation._id,
      messageType: image ? 'image' : 'text',
      textContent: message || '',
      imageUrl: imgUrl || '',
    });

    if (newMessage) {
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageAt = new Date();
    }    await Promise.all([conversation.save(), newMessage.save()]);    // Only emit to receiver if it's not a self-chat
    if (!isSelfChat) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
      }
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
    
    console.log('Getting messages - senderId:', senderId, 'userToChatId:', userToChatId);
    
    // Handle self-chat (saved messages)
    const isSelfChat = senderId.toString() === userToChatId.toString();
    console.log('Is self chat:', isSelfChat);
    
    const conversation = await Conversation.findOne({
      participants: isSelfChat ? [senderId] : { $all: [senderId, userToChatId] },
    });

    console.log('Found conversation:', conversation?._id);

    if (!conversation) {
      console.log('No conversation found, returning empty array');
      // Return an empty array when there's no conversation to prevent "not iterable" errors
      return res.status(200).json([]);
    }
      // Get messages by conversationId using new schema
    let messages = await Message.find({
      conversationId: conversation._id
    }).populate('senderId', 'fullName profilePic').sort({ createdAt: 1 });
    
    // If no messages found with new schema, try old schema (direct participant matching)
    if (messages.length === 0) {
      console.log('No messages found with new schema, trying old schema...');
      if (isSelfChat) {
        // For self-chat, both sender and receiver are the same
        messages = await Message.find({
          senderId,
          receiverId: senderId
        }).populate('senderId', 'fullName profilePic').sort({ createdAt: 1 });
      } else {
        // For regular chat, find messages between the two users
        messages = await Message.find({
          $or: [
            { senderId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: senderId }
          ]
        }).populate('senderId', 'fullName profilePic').sort({ createdAt: 1 });
      }
    }
    
    console.log('Found messages count:', messages.length);
    
    // Format messages to include sender name for avatars and maintain backward compatibility
    const formattedMessages = messages.map(msg => {
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
      
      // Ensure backward compatibility with frontend
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
    console.error("Error getting messages:", error);
    res.status(500).json({ error: error.message || "Failed to get messages" });
  }
};
