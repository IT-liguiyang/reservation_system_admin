/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  Input,
  Button,
  Form
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';
import { reqUpdateSystemAdmin } from '../../api';

// 添加系统管理员组件
const SystemAdminUpdate = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改系统管理员信息</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateSystemAdmin = async (values) => {
    // 1. 得到当前时间作为提交时间
    const submit_time = moment().format('YYYY-MM-DD HH:mm'); 
    console.log(submit_time);
 
    // 2. 得到输入的值
    const { 
      realname, 
      username, 
      password
    } = values;
 
    // 3. 生成系统管理员对象
    const system_adminObj = {
      realname, 
      username, 
      password
    };
 
    console.log(system_adminObj);
 
    const system_adminId = props.history.location.state._id;  // 得到当前行系统管理员的id
    // 4. 提交添加的请求
    const result = await reqUpdateSystemAdmin({system_adminObj, system_adminId, password});
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('修改系统管理员成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到系统管理员列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至系统管理员列表页面
        },
        onCancel() {
          // formElement.current.resetFields(); //留在添加页面并清除输入的信息
        },
      });
    }
    if (result.status === 1) {
      message.error(result.msg);
    }
  };

  // 得到回显的 system_adminObj
  const system_adminObj = props.history.location.state;
  const {  // 对象的省略写法 res_realname: res_realname, 写成 res_realname
    realname, 
    username, 
    // password
  } = system_adminObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateSystemAdmin}
        initialValues={{  // 为表单类input输入框设置初始默认值，对象的省略写法
          realname, 
          username, 
          // password
        }}
      >
        <Form.Item
          name="realname"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入姓名!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入姓名' />
        </Form.Item>
        <Form.Item
          name="username"
          label="账号"
          rules={[
            {
              required: true,
              message: '请输入手机号!',
              whitespace: true,
            },
            {
              pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
              message:'输入的手机号格式错误!'
            },
          ]}
        >
          <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码!',
              whitespace: true,
            },
            {
              pattern:/^[a-zA-Z][a-zA-Z0-9_]{8,12}$/, 
              message:'8-12位, 字母开头且仅由字母,数字,下划线组成'
            }
          ]}
        >
          <Input.Password placeholder='请输入密码' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' style={{marginLeft:70+'px'}} htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/admin/system_admin')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SystemAdminUpdate;