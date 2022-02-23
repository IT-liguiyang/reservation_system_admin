import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/schooladmin_register' component={Register}></Route>
          <Route path='/' component={Home}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}