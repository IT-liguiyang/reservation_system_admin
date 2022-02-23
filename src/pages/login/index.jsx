/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Radio, message  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './index.less';
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

export default class Login extends Component {

  // state = { initialValues:'1' }

  render() {
    // 如果用户已经登陆, 自动跳转到管理界面
    const admin = memoryUtils.admin;
    if(admin && admin._id) {
      return <Redirect to='/'/>;
    }

    const onFinish = async (values) => {
      // console.log('Received values of form: ', values);
      if(values){
        const { username, password, role_id } = values;
        const result = await reqLogin( username, password, role_id );
        // console.log(result);
        if (result.status===0) { // 登陆成功
          // 提示登陆成功
          message.success('登陆成功');
          
          // 保存登录的admin
          const admin = result.data;
          memoryUtils.admin = admin; // 保存在内存中
          storageUtils.saveAdmin(admin); // 保存到local中
          
          // 跳转到管理界面 (不需要再回退回到登陆)
          this.props.history.replace('/');
          
        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg);
        }
      } else {
        console.log('检验失败！');
      }
    };

    return (
      <div className="login">
        <section className="login-content">
          <h2>登录界面</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
              role_id:'1', // 设置登录模式默认值
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入手机号!',
                },
                {
                  pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
                  message:'输入的手机号格式错误!'
                },
              ]}
                            
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>

              {/* <a className="login-form-forgot" href="">
                                忘记密码
                            </a> */}
              <Form.Item className="role_id" name="role_id">
                <Radio.Group>
                  <Radio value={'1'}>系统管理员</Radio>
                  <Radio value={'2'}>学校管理员</Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
              </Button>
              <Button type="primary" className="login-form-register-button">
                <Link to='/schooladmin_register' >注册</Link>
              </Button>
            </Form.Item>
          </Form>
        </section>
        <footer className="login-footer">Copyright © 2021 - 2022 IT-GUIYANG. All Rights Reserved. 木子牛八 版权所有</footer>
      </div>
    );
  }
}
