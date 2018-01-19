import { combineReducers } from 'redux';

import nav from './navReducer.js';
import user from './userReducer.js';
import topic from './topicReducer.js';
import search from './searchReducer.js';
import topicList from './topicListReducer.js';
import utilsBar from './utilsBarReducer.js';
import comment from './commentReducer.js';
import chat from './chatReducer.js';

export default combineReducers({
  nav,
  user,
  topic,
  search,
  topicList,
  utilsBar,
  comment,
  chat
});
