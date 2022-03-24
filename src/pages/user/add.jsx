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

import LinkButton from '../../components/link-button';
import { reqAddUser } from '../../api';
import PicturesWall from '../../utils/pictures-wall';

// 添加用户组件
const UserAdd = (props) => {

  const image = React.createRef();  // 得到头像上传对象

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加用户</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddUser = async (values) => {

    // 1. 得到输入的值
    const { 
      username, 
      // password, 
      realname, 
      ID_number, 
      address, 
      profession, 
      realname_authentication
    } = values;

    // 2. 生成预约信息对象
    const userObj = {
      username, 
      head_portrait: image.current? image.current.getImgs():{},
      realname, 
      ID_number, 
      address, 
      profession, 
      realname_authentication
    };

    console.log(userObj);

    // 2. 提交添加的请求
    const result = await reqAddUser(userObj);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加用户成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到用户列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至用户列表页面
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

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={AddUser}
      >
        <Form.Item
          name="username"
          label="账号"
          rules={[
            {
              required: true,
              message: '请输入账号(手机号)!',
              whitespace: true,
            },
            {
              pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
              message:'输入的手机号格式错误!'
            },
          ]}
        >
          <Input placeholder='请输入账号(手机号)' />
        </Form.Item>
        <Form.Item 
          label="头像"
          rules={[
            {
              required: true,
              message: '请上传图片!',
            },
          ]}
        >
          <PicturesWall ref={image} imgs={[]}/>
        </Form.Item>
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
          name="ID_number"
          label="身份证号"
          rules={[
            {
              required: true,
              message: '请输入身份证号!',
              whitespace: true,
            },
            {
              pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
              message:'输入的身份证号格式错误!'
            },
          ]}
        >
          <Input placeholder='请输入身份证号' />
        </Form.Item>
        <Form.Item
          name="address"
          label="住址"
          rules={[
            {
              required: true,
              message: '请输入住址!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入住址' />
        </Form.Item>
        <Form.Item
          name="profession"
          label="职业"
          rules={[
            {
              required: true,
              message: '请输入职业!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入职业' />
        </Form.Item>
        <Form.Item
          name="realname_authentication"
          label="实名认证"
          rules={[
            {
              required: true,
              message: '输入是否已实名认证!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入“已完成”或“未完成”' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/user')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserAdd;