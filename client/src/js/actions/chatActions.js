export const addMessage = (message) => {
  return {
    type: 'message',
    payload: message
  };
};