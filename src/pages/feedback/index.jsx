import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Feedback from './feedback';
import FeedbackUpdate from './update';
import FeedbackAdd from './add';

/*
公告路由
 */
export default class FeedbackIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/feedback' component={Feedback} exact/> {/*路径完全匹配*/}
        <Route path='/feedback/add' component={FeedbackAdd}/>
        <Route path='/feedback/update' component={FeedbackUpdate}/>
        <Redirect to='/feedback'/>
      </Switch>
    );
  }
}