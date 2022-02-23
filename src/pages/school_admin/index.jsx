import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SchoolAdmin from './school_admin';
import SchoolAdminUpdate from './update';
import SchoolAdminAdd from './add';

/*
学校管理员路由
 */
export default class SchoolAdminIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/admin/school_admin' component={SchoolAdmin} exact/> {/*路径完全匹配*/}
        <Route path='/admin/school_admin/add' component={SchoolAdminAdd}/>
        <Route path='/admin/school_admin/update' component={SchoolAdminUpdate}/>
        <Redirect to='/admin/school_admin'/>
      </Switch>
    );
  }
}