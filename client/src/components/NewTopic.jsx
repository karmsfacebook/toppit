import React from 'react';
import {Form, Image, Dimmer, Button, Segment, Container, Grid, Header, Icon, Message } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import emojis from '../emojis';
import anonPhoto1 from '../images/anonPhoto1.png';
import anonPhoto2 from '../images/anonPhoto2.png';
import anonPhoto3 from '../images/anonPhoto3.png';
import anonPhoto4 from '../images/anonPhoto4.png';
import defaultPhoto from '../images/defaultPhoto.jpg';
import { 
  displayNewTopic, setHeadline, setDescription,
  setEmotion, setCommentText, setAnon, setUpvoteStateColor, setSubtoppitToPostTo
} from '../js/actions/topicActions.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import store from '../js/store.js';

const anonPhotos = [
  anonPhoto1,
  anonPhoto2,
  anonPhoto3,
  anonPhoto4
];

class NewTopic extends React.Component {
  constructor(props) {
    super(props);

    this.onHeadlineChange = this.onHeadlineChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEmotion = this.onEmotion.bind(this);
    this.toggleAnonymous = this.toggleAnonymous.bind(this);
  }

  onHeadlineChange(e, { value }) {
    this.props.setHeadline(value);
  }

  onDescriptionChange(e, { value }) {
    this.props.setDescription(value);
  }

  onEmotion(e, {value}) {
    // console.log('on emotion...', e)
    // console.log('value...', {value});
    this.props.setEmotion(value);
  }

  toggleAnonymous() {
    let topic = store.getState().topic.topic;
    if (topic.anon) {
      this.props.setAnon(false);
    } else {
      this.props.setAnon(true);
    }
  }

  onSubmit(e, { value }) {
    var errors = false;
    if (document.querySelector('#subtoppitSelectionForPost .text').innerHTML === '') {
      document.querySelector('.dimmer .form').classList.add('error');
      document.querySelector('#subtoppitSelectionForPost').classList.add('error');
      errors = true;
    }
    if (document.querySelector('#topicHeadline').value === '') {
      document.querySelector('#topicHeadline').parentNode.parentNode.classList.add('error');
      document.querySelector('.dimmer .form').classList.add('error');
      errors = true;
    }
    if (document.querySelector('#topicDescription').value === '') {
      document.querySelector('#topicDescription').parentNode.classList.add('error');
      document.querySelector('.dimmer .form').classList.add('error');
      errors = true;
    }
    if (errors) {
      return;
    }
    // if (document.querySelector(".form .dropdown .text").innerHTML = '') {
    //   console.log(document.querySelector(".form .dropdown .text"));
    //   return;
    // }

    let topic = store.getState().topic.topic;
    let user = store.getState().user.user;

    if (topic.headline.length > 0 && topic.description.length > 0) {
      this.props.history.push('/');
      let topicObj = {
        headline: topic.headline,
        description: topic.description,
        subtoppit: topic.subtoppit,
        emotion: topic.emotion,
        timeStamp: Date.now(),
        upvotes: 0
      };
      
      topicObj.authorId = (!topic.anon) ? user.id : null;
      topicObj.authorUsername = (!topic.anon) ? user.username : 'Anonymous';

      console.log('submitting...', topicObj);
      this.props.onNewTopic(topicObj);
    }
    this.props.setSubtoppitToPostTo('');
    this.props.setAnon(false);
  }
  

  onSubtoppitSelection(e, {value}) {
    var subtoppit = {value}.value;
    this.props.setSubtoppitToPostTo(subtoppit)
  }

  render() {
    const anonText = 'Post Anonymously';
    let topic = store.getState().topic.topic;
    console.log(topic);
    let photoUrl;
    console.log(this.props);
    if (topic.anonymous) {
      photoUrl = anonPhotos[Math.floor(Math.random() * anonPhotos.length)];
    } else {
      photoUrl = (this.props.currentUser && this.props.currentUser.photo) || defaultPhoto;
    }
    this.subtoppits = [
      {value: 'introductions', text: 'introductions'},
      {value: 'chatter', text: 'chatter'},
      {value: 'legacyProject', text: 'legacyProject'}, 
      {value: 'greenFieldProject', text: 'greenFieldProject'},
      {value: 'cats', text: 'cats'},
      {value: 'dogs', text: 'dogs'},
    ];

    return (
      <Dimmer.Dimmable as={Form} blurring dimmed={this.props.active}>
        <Dimmer active={this.props.active} inverted page>
          <Container textAlign='left'>
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column width={2}>
                  <Image className='topicavatar' size='tiny' circular src={photoUrl} />
                </Grid.Column>
                <Grid.Column width={12}>
                  <Form onSubmit={this.onSubmit}>
                    <Message error header='Missing field(s)' content='You have missing field(s)'/>
                    <Form.Input 
                      label='Topic Headline' 
                      name='headline' 
                      onChange={this.onHeadlineChange} 
                      id="topicHeadline"
                      placeholder='Enter the headline of your topic' />
                    <Form.TextArea 
                      label='Short Description' 
                      name='description' 
                      onChange={this.onDescriptionChange} 
                      id="topicDescription"
                      placeholder='Tell us a little more about your idea' />
                    <Form.Group inline>
                      <Form.Select label="I'm feeling ..." name='emotion' onChange={this.onEmotion} options={emojis} placeholder='Emotion' />
                      <Form.Select label="choose a subtoppit" id="subtoppitSelectionForPost" onChange={this.onSubtoppitSelection.bind(this)} options={this.subtoppits} /> 
                      <Form.Button type="submit">Submit</Form.Button>
                      <Form.Button type="submit" onClick={this.toggleAnonymous}>{anonText}</Form.Button>
                    </Form.Group>
                  </Form>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Link to='/'>
                    <Button circular icon='remove' onClick={this.props.closeNewTopic} />
                  </Link>
                </Grid.Column>
                <Grid.Column width={2}>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Dimmer>
      </Dimmer.Dimmable>
    );
  }
}

const mapStateToProps = (state) => ({
  displayNewTopic: state.topic.displayNewTopic,
  headline: state.topic.headline,
  description: state.topic.description,
  emotion: state.topic.emotion,
  anon: state.topic.anon,
  commentText: state.topic.commentText,
  upvoteStateColor: state.topic.upvoteStateColor,
  subtoppit: state.topic.subtoppit
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    displayNewTopic, setHeadline, setDescription,
    setEmotion, setCommentText, setAnon, setUpvoteStateColor, setSubtoppitToPostTo
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTopic);
