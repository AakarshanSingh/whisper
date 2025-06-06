export const restoreAppState = () => {
  try {
    const authData = localStorage.getItem('whisper');
    const conversationData = localStorage.getItem('selectedConversation');    if (authData && conversationData) {
      const auth = JSON.parse(authData);
      const conversation = JSON.parse(conversationData);

      return {
        isAuthenticated: !!auth.token,
        selectedConversation: conversation,
        authUser: auth,
      };
    }

    return {
      isAuthenticated: !!authData,
      selectedConversation: null,
      authUser: authData ? JSON.parse(authData) : null,
    };
  } catch (error) {
    console.error('Error restoring app state:', error);

    localStorage.removeItem('whisper');
    localStorage.removeItem('selectedConversation');
    return {
      isAuthenticated: false,
      selectedConversation: null,
      authUser: null,
    };
  }
};

export const clearAppState = () => {
  localStorage.removeItem('whisper');
  localStorage.removeItem('selectedConversation');
};
