import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import News from './news';
import NewsUpdate from './update';
import NewsAdd from './add';

/*
学校路由
 */
export default class NewsIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/news' component={News} exact/> {/*路径完全匹配*/}
        <Route path='/news/add' component={NewsAdd}/>
        <Route path='/news/update' component={NewsUpdate}/>
        <Redirect to='/news'/>
      </Switch>
    );
  }
}