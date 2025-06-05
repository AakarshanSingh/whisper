/**
 * Helper functions to handle page refresh scenarios
 */

export const restoreAppState = () => {
  try {
    // Check if user is authenticated
    const authData = localStorage.getItem('whisper');
    const conversationData = localStorage.getItem('selectedConversation');
    
    console.log('Restoring app state...');
    console.log('Auth data exists:', !!authData);
    console.log('Conversation data exists:', !!conversationData);
    
    if (authData && conversationData) {
      const auth = JSON.parse(authData);
      const conversation = JSON.parse(conversationData);
      
      console.log('Auth user:', auth.fullName);
      console.log('Selected conversation:', conversation.fullName);
      
      return {
        isAuthenticated: !!auth.token,
        selectedConversation: conversation,
        authUser: auth
      };
    }
    
    return {
      isAuthenticated: !!authData,
      selectedConversation: null,
      authUser: authData ? JSON.parse(authData) : null
    };
  } catch (error) {
    console.error('Error restoring app state:', error);
    // Clear corrupted data
    localStorage.removeItem('whisper');
    localStorage.removeItem('selectedConversation');
    return {
      isAuthenticated: false,
      selectedConversation: null,
      authUser: null
    };
  }
};

export const clearAppState = () => {
  localStorage.removeItem('whisper');
  localStorage.removeItem('selectedConversation');
  console.log('App state cleared');
};