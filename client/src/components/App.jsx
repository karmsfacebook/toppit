import React from 'react';
import TopicList from './TopicList.jsx';
import NewTopic from './NewTopic.jsx';
import Login from './Login.jsx';
import NavBar from './NavBar.jsx';
import UtilsBar from './UtilsBar.jsx';
import TopicDetailed from './TopicDetailed.jsx';
import axios from 'axios';
import { Menu, Image, Sticky } from 'semantic-ui-react';
import Logo from '../images/logo.png';
import Chat from './Chat.jsx';

var http = axios.create({
  withCredentials: true,
});

import {Link, Redirect, BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Button, Container, Header} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from '../js/store.js';
import { setUserId } from '../js/actions/userActions.js';
import { displayNewTopic } from '../js/actions/topicActions.js';
import { addTopicToList, addTopicToListFront, changeSearchedList, changeFilteredList, setSelectedTopic } from '../js/actions/topicListActions.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.createNewTopic = this.createNewTopic.bind(this);
    this.onNewTopic = this.onNewTopic.bind(this);
    this.closeNewTopic = this.closeNewTopic.bind(this);
    this.getAllTopics = this.getAllTopics.bind(this);
    this.upVote = this.upVote.bind(this);
    this.onDetailedTopic = this.onDetailedTopic.bind(this);
    // this.getSelectTopics = this.getSelectTopics.bind(this);
  }

  componentDidMount() {
   this.getCurrentUser()
      .then(() => (
        this.getAllTopics()))
      .catch( (err) => console.log(err.message));
  }

  getAllTopics() {
    //**need to set these in redux
    console.log('getting all topics');
    return http.get('/api/topics')
      .then(({ data }) => {
        this.props.changeSearchedList(data);
        this.props.changeFilteredList(data);
        
        data.forEach(topic => {
          this.props.addTopicToList(topic);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  getCurrentUser() {
    return http.get('/api/user/current')
      .then(({data}) => {
        console.log('Current User ', data);
        this.props.setUserId(data._id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  createNewTopic() {
    this.props.displayNewTopic(true);
  }

  closeNewTopic() {
    this.props.displayNewTopic(false);
  }

  
  onNewTopic (topic) {
    //do server request to add new topic to database 
    //then get new topic and render new list to topic list.
    this.props.displayNewTopic(false);

    http.post('/api/topic', topic)
      .then(({data}) => {
        //** need to rerender page
        this.props.addTopicToListFront(data);
        this.props.changeSearchedList(store.getState().topicList.fullTopicList);
        this.props.changeFilteredList(store.getState().topicList.fullTopicList);
        console.log('Successfully posted ', data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  onDetailedTopic(topic) {
    this.props.setSelectedTopic(topic);
  }

  upVote (topicId, currentUser, increment, upvoteOrDownvote) {
    http.patch(`/api/topic/${topicId}`, {
      upvotes: increment,
      currentUser: currentUser
    })      
      .then( ({data}) => {
        this.createNewFilteredTopicList(upvoteOrDownvote, increment, currentUser, topicId);
      })
      .catch( (error) => {
        console.log(error);
      });
    
  }

  addUpvoteAndUser(topic, userId) {
    topic.upvotes += 1;
    topic.upvoteUsers.push(userId);
        console.log('topic......', topic);
    return topic;
  }

  deleteUpvoteAndUser(topic, userId) {
    topic.upvotes -= 1;
    topic.upvoteUsers.splice(topic.upvoteUsers.indexOf(userId), 1);
    return topic;
  }

  createNewFilteredTopicList(upvoteOrDownvote, newVoteTotal, userId, topicId) {
    // var fullTopicList = JSON.parse(JSON.stringify(store.getState().topicList.fullTopicList));
    // var viewedTopicList = JSON.parse(JSON.stringify(store.getState().topicList.viewedTopicList));
    console.log('store...', store.getState());
    var newFilteredTopicList = [...store.getState().topicList.filteredTopicList];
    if (upvoteOrDownvote === 1) {
      for (var j = 0; j < newFilteredTopicList.length; j++) {
        var topic = newFilteredTopicList[j];
        if (topic._id === topicId) {
          var selectedTopic = {...topic};
          selectedTopic.upvoteUsers = [...topic.upvoteUsers];
          selectedTopic = this.addUpvoteAndUser(selectedTopic, userId);
          newFilteredTopicList[j] = selectedTopic;
        }
      }
    } else if (upvoteOrDownvote === -1) {
      for (var j = 0; j < newFilteredTopicList.length; j++) {
        var topic = newFilteredTopicList[j];
        if (topic._id === topicId) {
          var selectedTopic = {...topic};
          selectedTopic.upvoteUsers = [...topic.upvoteUsers];
          selectedTopic = this.deleteUpvoteAndUser(selectedTopic, userId);
          newFilteredTopicList[j] = selectedTopic;
        }
      }
    }
    this.props.changeFilteredList(newFilteredTopicList);
  }





  downVote (topicId) {

  }  

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    let username = this.props.username;
    // console.log(this.props.user.password);
    let topic = store.getState().topic.topic;
    // store.dispatch({type:'server/hello', data:'Hello!', user: username});

    return (
      <div className='mainapp'>
        <NavBar 
          history={this.props.history} 
          home={this.getAllTopics} 
          createNewTopic={this.createNewTopic}
        />
        <Switch>
          <Route path='/share' render={(props) => (
            <Container>
              <NewTopic {...props}
                onNewTopic={this.onNewTopic}
                active={topic.displayNewTopic}
                closeNewTopic={this.closeNewTopic}
              />
            </Container>
          )}/>
          <Route path='/chat' render={(props) => (
            <Chat />
          )}/>
          <Route exact path='/' render={(props) => (
            <div>
              <Container>
                <UtilsBar 
                  // defaultFilter={this.state.filterBy} 
                  // defaultSort={this.state.sortBy} 
                  // onDropdownChange={this.getSelectTopics}
                />
                <TopicList {...props} 
                  // currentUser={this.state.currentUser}
                  upVote={this.upVote} 
                  onDetailedTopic={this.onDetailedTopic} 
                />
              </Container>
            </div>
          )}/>
          <Route path='/topic/:topicId' render={(props) => (
            <Container>
              <TopicDetailed 
                {...props} 
                topicId={props.match.params.topicId} 
                upvote={this.upVote}
              />
            </Container>
          )}/>
        </Switch>
        <Menu attached='bottom' className='footer'>
          <Menu.Item >
            <i className="copyright icon"></i><p>2018 Prospective Technologies, Inc. All Rights Reserved.</p>
          </Menu.Item> 
          <Menu.Item className="toTop button" onClick={this.topFunction} >
            <i className="arrow up icon"></i>
          </Menu.Item>
          <Menu.Item >
            <img className="logo" src={Logo} />
          </Menu.Item> 
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  displayNewTopic: state.topic.displayNewTopic,
  id: state.user.user.id,
  filteredTopicList: state.topicList.filteredTopicList,
  selectedTopic: state.topicList.selectedTopic,
  fullTopicList: state.topicList.fullTopicList
  username: state.user.user.username,
  viewedTopicList: state.topicList.viewedTopicList,
  selectedTopic: state.topicList.selectedTopic
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ displayNewTopic, setUserId, addTopicToList, 
    addTopicToListFront, changeSearchedList, changeFilteredList, setSelectedTopic }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);