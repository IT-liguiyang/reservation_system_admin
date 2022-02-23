import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Button,
  message,
} from 'antd';

import './index.less';
import { SCHOOL_LIST} from '../../utils/school-list.js';
import { reqRegisterSchoolAdmin } from '../../api/index';

const { Option } = Select;

export default class Register extends Component {
    RegisterSchoolAdmin = async (values) => {
      // console.log('Received values of form: ', values);
      const { username, password, realname, school, ID_number } = values;
      // 1. 生成学校管理员对象
      const schooladminObj = {
        username,
        password, 
        realname, 
        school, 
        ID_number,
        role_id: '2',
        auth_time: '', // 授权时间
        auth_person: '', // 授权人
        auth_menus: [], // 所有有权限操作的菜单path的数组
      };
      // 2. 提交添加的请求
      const result = await reqRegisterSchoolAdmin(schooladminObj);
      // console.log(result);
      // 3. 更新列表显示
      if(result.status===0) {
        message.success('注册成功');
        // resetFields();
      }
      if(result.status===1) {
        message.error(result.msg);
      }
    };

    render() {
      const formItemLayout = {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 8,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 16,
          },
        },
      };
        
      const prefixSelector = (
        <Form.Item name="prefix" noStyle>
          <Select
            style={{
              width: 70,
            }}
          >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
        </Form.Item>
      );

      return (
        <div className="register">
          <section className="register-content">
            <h2>注册界面</h2>
            <Form
              {...formItemLayout}
              className="register-form"
              name="register"
              onFinish={this.RegisterSchoolAdmin}
              initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
              }}
              scrollToFirstError
            >
              <Form.Item
                name="username"
                label="手机号"
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
                <Input
                  placeholder='请输入您的手机号'
                  addonBefore={prefixSelector}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>

              <Form.Item 
                label="手机验证"
                name="verificationCode"
                rules={[
                  {
                    required: true,
                    message: '请输入短信验证码!',
                  },
                  {
                    pattern:/^\d{6}$/, 
                    message:'请输入6位的短信验证码!'
                  },
                ]}
              >
                <Row gutter={10}>
                  <Col span={14.5} style={{'paddingRight': 0}}>
                    <Input placeholder='请输入验证码' />
                  </Col>
                  <Col span={9.5} style={{'paddingLeft': 0+'px'}}>
                    <Button  style={{'paddingLeft': 12+'px','paddingRight': 11+'px'}}>获取验证码</Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    pattern:/^[a-zA-Z][a-zA-Z0-9_]{8,12}$/, 
                    message:'8-12位, 字母开头且仅由字母,数字,下划线组成'
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder='请输入您的密码' />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请再次输入密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('您两次输入的密码不一致!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder='请再次输入您的密码' />
              </Form.Item>

              <Form.Item
                name="realname"
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓名!',
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder='请输入您的姓名' />
              </Form.Item>

              <Form.Item
                name="ID_number"
                label="身份证号"
                rules={[
                  {
                    required: true,
                    message: '请输入您的身份证号!',
                    whitespace: true,
                  },
                  {
                    pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
                    message:'输入的身份证号格式错误!'
                  },
                ]}
              >
                <Input placeholder='请输入您的身份证号' />
              </Form.Item>

              <Form.Item 
                name="school"
                label="您的学校"
                rules={[
                  {
                    required: true,
                    message: '请选择您所在的学校!',
                  }
                ]}
              >
                <Cascader placeholder='请选择您所在的学校'
                  options= {SCHOOL_LIST}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-register-button">注册</Button>
                <Button type="primary" className="register-form-login-button">
                  <Link to='/login' >返回登录</Link>
                </Button>
              </Form.Item>
            </Form>
          </section>
          <footer className="register-footer">Copyright © 2021 - 2022 IT-GUIYANG. All Rights Reserved. 木子牛八 版权所有</footer>
        </div>
      );
    }
}

