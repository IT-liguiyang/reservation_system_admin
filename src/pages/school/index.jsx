import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import School from './school';
import SchoolUpdate from './update';
import SchoolAdd from './add';

/*
学校路由
 */
export default class SchoolIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/school' component={School} exact/> {/*路径完全匹配*/}
        <Route path='/school/add' component={SchoolAdd}/>
        <Route path='/school/update' component={SchoolUpdate}/>
        <Redirect to='/school'/>
      </Switch>
    );
  }
}