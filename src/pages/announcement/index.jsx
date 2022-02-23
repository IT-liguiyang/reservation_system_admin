import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Announcement from './announcement';
import AnnouncementUpdate from './update';
import AnnouncementAdd from './add';

/*
公告路由
 */
export default class AnnouncementIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/announcement' component={Announcement} exact/> {/*路径完全匹配*/}
        <Route path='/announcement/add' component={AnnouncementAdd}/>
        <Route path='/announcement/update' component={AnnouncementUpdate}/>
        <Redirect to='/announcement'/>
      </Switch>
    );
  }
}