import User from '../models/UserSchema.js';
import Conversation from '../models/ConversationSchema.js';

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Conversation.find({
      participants: loggedInUserId,
      lastMessage: { $exists: true, $ne: null },
    })
      .populate('participants', 'fullName profilePic username')
      .populate('lastMessage', 'textContent messageType createdAt')
      .sort({ lastMessageAt: -1 }); // Sort by most recent message

    const formattedConversations = conversations
      .map((conversation) => {
        // Check if this is a self-chat (saved messages)
        const isSelfChat =
          conversation.participants.length === 1 &&
          conversation.participants[0]._id.toString() ===
            loggedInUserId.toString();

        if (isSelfChat) {
          return {
            _id: loggedInUserId,
            fullName: 'Saved Messages',
            profilePic: req.user.profilePic,
            username: req.user.username,
            lastMessage:
              conversation.lastMessage?.textContent ||
              (conversation.lastMessage?.messageType === 'image'
                ? '📷 Image'
                : ''),
            lastMessageAt: conversation.lastMessageAt,
            conversationId: conversation._id,
          };
        }

        const otherParticipant = conversation.participants.find(
          (participant) =>
            participant._id.toString() !== loggedInUserId.toString()
        );

        if (!otherParticipant) return null;

        return {
          _id: otherParticipant._id,
          fullName: otherParticipant.fullName,
          profilePic: otherParticipant.profilePic,
          username: otherParticipant.username,
          lastMessage:
            conversation.lastMessage?.textContent ||
            (conversation.lastMessage?.messageType === 'image'
              ? '📷 Image'
              : ''),
          lastMessageAt: conversation.lastMessageAt,
          conversationId: conversation._id,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
