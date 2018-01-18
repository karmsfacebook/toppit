import React from 'react';
import SortList from './SortList.jsx';
import FilterList from './FilterList.jsx';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setFilter, setSort } from '../js/actions/utilsBarActions.js';

import { changeViewedList } from '../js/actions/topicListActions.js';

import { bindActionCreators } from 'redux';
import store from '../js/store.js';

class UtilsBar extends React.Component {
  constructor(props) {
    super(props);

    // this.state = ({
    //   filterBy: props.defaultFilter,
    //   sortBy: props.defaultSort
    // });
  }
  
  //  test topic list [{upvotes: 2},{upvotes:3},{upvotes: 4}]

  sortFullTopicListByUpvotes(fullTopicList){
    return fullTopicList.sort(function(a, b){
      return a.upvotes-b.upvotes;
    });
  }

  sortFullTopicListByTimeStamp(fullTopicList){
    return fullTopicList.sort(function(a, b){
      return a.timestamp-b.timestamp;
    });
  }

  //sortFullTopicsListByTimestamp

  onSortChange(sortBy) {
    let sortedFullTopicList;
    //sets sort state with sortBy value
    this.props.setSort(sortBy);
    let fullTopicList = store.getState().topicList.fullTopicList;
    //determines how to sort list by sortBy value
    if (sortBy === 'upvotes') {
      sortedFullTopicList = this.sortFullTopicListByUpvotes(fullTopicList);
    } else if (sortBy === 'timeStamp') {
      sortedFullTopicList = this.sortFullTopicListByTimeStamp(fullTopicList);
    }
    //changes viewed list
    this.props.changeViewedList(sortedFullTopicList);
  }

  onFilterChange(filterBy) {
    let filteredFullTopicList;
    //sets filter state with filterBy value
    this.props.setFilter(filterBy);
    //gets emotion value
    let emotion = store.getState().utilsBar.filter.filterBy;
    let fullTopicList = store.getState().topicList.fullTopicList;
    //determines how to filter depending on emotion value
    if (emotion !== ''){
      filteredFullTopicList = fullTopicList.filter((topic) => {
        return topic.emotion === emotion;
      });
    } else {
      filteredFullTopicList = fullTopicList;
    }
    //changes viewed list to sorted list
    this.props.changeViewedList(filteredFullTopicList);
  }

  render() {
    return (
      <Menu secondary>
        <Menu.Item position='right'>
          <SortList  
            defaultSort={this.props.defaultSort} 
            onSortChange={this.onSortChange.bind(this)}/>
        </Menu.Item>
        <Menu.Menu>
          <Menu.Item>
            <FilterList 
              defaultFilter={this.props.defaultFilter}
              onFilterChange={this.onFilterChange.bind(this)}/>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => ({
  filter: state.filter,
  sort: state.sort
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setFilter, setSort, changeViewedList }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UtilsBar);
// export default UtilsBar;