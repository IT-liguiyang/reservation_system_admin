/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  Input,
  Button,
  Form,
  // Cascader
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';

import { reqUpdateSchoolAdmin } from '../../api';

// 添加学校管理员组件
const SchoolAdminUpdate = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改学校管理员信息</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateSchoolAdmin = async (values) => {
    // 1. 得到当前时间作为提交时间
    const submit_time = moment().format('YYYY-MM-DD HH:mm'); 
    console.log(submit_time);
 
    // 2. 得到输入的值
    const { 
      username,
      // password, // 密码不能修改
      realname,
      school_name, 
      ID_number, 
    } = values;
 
    // 3. 生成学校管理员对象
    const school_adminObj = {
      username,
      // password,  // 密码不能修改
      realname,
      school_name, 
      ID_number, 
    };
 
    console.log(school_adminObj);
 
    const school_adminId = props.history.location.state._id;  // 得到当前行公告的id
    // 4. 提交添加的请求
    const result = await reqUpdateSchoolAdmin({school_adminObj, school_adminId});
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('修改学校管理员成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到学校管理员列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至学校管理员列表页面
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

  // 得到回显的 school_adminObj
  const school_adminObj = props.history.location.state;
  const {  // 对象的省略写法 res_realname: res_realname, 写成 res_realname
    username,
    password, 
    realname,
    school, 
    ID_number, 
  } = school_adminObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateSchoolAdmin}
        initialValues={{  // 为表单类input输入框设置初始默认值，对象的省略写法
          username,
          password, 
          realname,
          school:school[0]+'/'+school[1], 
          ID_number, 
        }}
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
          <Input disabled />
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
            // {
            //   pattern:/^[a-zA-Z][a-zA-Z0-9_]{8,12}$/, 
            //   message:'8-12位, 字母开头且仅由字母,数字,下划线组成'
            // }
          ]}
        >
          <Input.Password disabled />
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
          {/* <Cascader placeholder='请选择您所在的学校'
            options= {SCHOOL_LIST}
          /> */}
          <Input disabled />
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
          <Button type='primary' style={{marginLeft:70+'px'}} htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/admin/school_admin')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SchoolAdminUpdate;