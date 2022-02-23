import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import DynamicSharing from './dynamic_sharing';
import DynamicSharingUpdate from './update';
import DynamicSharingAdd from './add';
import DynamicSharingAddComment from './add_comment';

/*
动态分享路由
 */
export default class DynamicSharingIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/dynamic_sharing' component={DynamicSharing} exact/> {/*路径完全匹配*/}
        <Route path='/dynamic_sharing/add' component={DynamicSharingAdd}/>
        <Route path='/dynamic_sharing/update' component={DynamicSharingUpdate}/>
        <Route path='/dynamic_sharing/add_comment' component={DynamicSharingAddComment}/>
        <Redirect to='/dynamic_sharing'/>
      </Switch>
    );
  }
}