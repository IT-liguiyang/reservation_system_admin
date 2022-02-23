import React, { Component } from 'react';

import NumberInfo from './number_info';
import SchoolDistribution from './school_distribution';

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <NumberInfo />
        <SchoolDistribution />
      </div>
    );
  }
}
