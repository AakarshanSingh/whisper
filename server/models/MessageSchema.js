import mongoose, { mongo } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
    },
    image: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    messageType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    textContent: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
