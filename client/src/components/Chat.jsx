import React from "react";
import io from "socket.io-client";
import { Modal, Icon, Header, Container, Segment,  
         Form, TextArea, Button } from 'semantic-ui-react';
import store from '../js/store.js';
import { bindActionCreators } from 'redux';
import addMessage from '../js/actions/chatActions.js'; 
import { connect } from 'react-redux';

class Chat extends React.Component {
  constructor(props) {
    super(props)
  }

  handleKeyUp(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    let message = document.getElementById('input-message').value;
    let user = store.getState().user.user.username;
    store.dispatch({type:'server/hello', data:message, user: user});
    document.getElementById('input-message').value = '';
  }

  render() {
    var messages = this.props.messages;
    return (
      <div className="chat">
          <Header className="chat-header"
            as='h2'>
              <Icon name='talk outline' />
              <Header.Content>Chat here</Header.Content>
          </Header>
          <hr/>
          <div className="messages">
            <Container textAlign='left'>
              {messages.map( (message) => (
                <div>
                  {message[0]}: {message[1]}
                </div>
              ))}
            </Container>
          </div>
          <div>
            <Form>
              <Form.Field> 
                <label>Message</label> 
                <TextArea id="input-message"
                          placeholder='Message' 
                          onKeyUp={this.handleKeyUp.bind(this)} />
              </Form.Field>
            </Form>
            <br/>
            <Button onClick={this.sendMessage.bind(this)} >Send</Button>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addMessage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);