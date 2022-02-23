import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

// 读取local中保存admin, 保存到内存中
const admin = storageUtils.getAdmin();
memoryUtils.admin = admin;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
