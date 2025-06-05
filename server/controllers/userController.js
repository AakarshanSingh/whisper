import User from '../models/UserSchema.js';
import Conversation from '../models/ConversationSchema.js';
import Message from '../models/MessageSchema.js';

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

    // Find all conversations where the user is a participant and has messages
    const conversations = await Conversation.find({
      participants: loggedInUserId,
      lastMessage: { $exists: true, $ne: null }
    })
    .populate('participants', 'fullName profilePic username')
    .populate('lastMessage', 'textContent messageType createdAt')
    .sort({ lastMessageAt: -1 }); // Sort by most recent message

    // Format conversations to include the other participant's info
    const formattedConversations = conversations.map(conversation => {
      // Check if this is a self-chat (saved messages)
      const isSelfChat = conversation.participants.length === 1 && 
                        conversation.participants[0]._id.toString() === loggedInUserId.toString();
      
      if (isSelfChat) {
        // For self-chat, show "Saved Messages"
        return {
          _id: loggedInUserId,
          fullName: 'Saved Messages',
          profilePic: req.user.profilePic,
          username: req.user.username,
          lastMessage: conversation.lastMessage?.textContent || 
                      (conversation.lastMessage?.messageType === 'image' ? '📷 Image' : ''),
          lastMessageAt: conversation.lastMessageAt,
          conversationId: conversation._id
        };
      }

      // Get the other participant (not the logged-in user)
      const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== loggedInUserId.toString()
      );

      if (!otherParticipant) return null;

      return {
        _id: otherParticipant._id,
        fullName: otherParticipant.fullName,
        profilePic: otherParticipant.profilePic,
        username: otherParticipant.username,
        lastMessage: conversation.lastMessage?.textContent || 
                    (conversation.lastMessage?.messageType === 'image' ? '📷 Image' : ''),
        lastMessageAt: conversation.lastMessageAt,
        conversationId: conversation._id
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
