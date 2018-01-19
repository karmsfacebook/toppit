export default function reducer(state = {
  messages: [],
}, action){
  switch(action.type){
    case 'message':
      return {
        ...state,
        messages: [...state.messages, [action.user, action.data]]
      }
    default:
      return state;
  }
}
