/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  Input,
  Button,
  Form,
  Cascader
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';
import { SCHOOL_LIST} from '../../utils/school-list.js';
import { reqAddSchoolAdmin } from '../../api';

// 学校管理员组件
const SchoolAdminAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>学校管理员</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddSchoolAdmin = async (values) => {
    // 1. 得到当前时间
    const submit_time = moment().format('YYYY-MM-DD HH:mm'); 
    console.log(submit_time);

    // 2. 得到输入的值
    const { 
      username,
      password, 
      realname,
      school, 
      ID_number, 
    } = values;

    console.log('8888',school);

    // 3. 生成预约信息对象
    const school_adminObj = {
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

    console.log(school_adminObj);

    // 4. 提交添加的请求
    const result = await reqAddSchoolAdmin(school_adminObj);
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('学校管理员成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到学校管理员列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至预约信息列表页面
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
        onFinish={AddSchoolAdmin}
      >
        <Form.Item
          name="username"
          label="账号"
          rules={[
            {
              required: true,
              message: '请输入学校管理员账号!',
              whitespace: true,
            },
            {
              pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
              message:'输入的手机号格式错误!'
            }
          ]}
        >
          <Input placeholder='请输入学校管理员账号' />
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
        <Form.Item
          name="realname"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入学校管理员姓名!',
              whitespace: true,
            }
          ]}
        >
          <Input placeholder='请输入学校管理员姓名' />
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
        <Form.Item
          name="ID_number"
          label="身份证号"
          rules={[
            {
              required: true,
              message: '请输入学校管理员的身份证号!',
              whitespace: true,
            },
            {
              pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
              message:'输入的身份证号格式错误!'
            }
          ]}
        >
          <Input placeholder='请输入学校管理员的身份证号' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/admin/school_admin')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SchoolAdminAdd;