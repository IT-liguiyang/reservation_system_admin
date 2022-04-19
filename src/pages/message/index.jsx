import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Message from './message';
import MessageUpdate from './update';
import MessageAdd from './add';

/*
公告路由
 */
export default class MessageIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/message' component={Message} exact/> {/*路径完全匹配*/}
        <Route path='/message/add' component={MessageAdd}/>
        <Route path='/message/update' component={MessageUpdate}/>
        <Redirect to='/message'/>
      </Switch>
    );
  }
}