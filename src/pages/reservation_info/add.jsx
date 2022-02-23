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
import { reqAddReservationInfo } from '../../api';

// 添加预约信息组件
const ReservationInfoAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加预约信息</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddReservationInfo = async (values) => {
    // 1. 得到当前时间
    const submit_time = moment().format('YYYY-MM-DD HH:mm'); 
    console.log(submit_time);

    // 2. 得到输入的值
    const { 
      res_realname, 
      res_username, 
      res_school, 
      res_area, 
      res_time, 
      has_partners, 
      partnerts_relation, 
      vehicle, 
      has_agreed_safety_commitment,
      has_agreed_antiepidemic_commitment 
    } = values;

    // 3. 生成预约信息对象
    const reservation_infoObj = {
      res_realname,
      res_username, 
      submit_time,
      res_school, 
      res_area, 
      res_time, 
      has_partners, 
      partnerts_relation, 
      vehicle, 
      has_agreed_safety_commitment, 
      has_agreed_antiepidemic_commitment
    };

    console.log(reservation_infoObj);

    // 4. 提交添加的请求
    const result = await reqAddReservationInfo(reservation_infoObj);
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('添加预约信息成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到预约信息列表页面?',
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
        onFinish={AddReservationInfo}
      >
        <Form.Item
          name="res_realname"
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
          name="res_username"
          label="手机号"
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
        {/* <Form.Item
          name="submit_time"
          label="提交时间"
          rules={[
            {
              required: true,
              message: '请输入提交时间!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入提交时间' />
        </Form.Item> */}
        <Form.Item
          name="res_school"
          label="已约学校"
          rules={[
            {
              required: true,
              message: '请输入已约学校!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约学校' />
        </Form.Item>
        <Form.Item
          name="res_area"
          label="已约场地"
          rules={[
            {
              required: true,
              message: '请输入已约场地!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约场地' />
        </Form.Item>
        <Form.Item
          name="res_time"
          label="已约时间"
          rules={[
            {
              required: true,
              message: '请输入已约时间!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约时间' />
        </Form.Item>
        <Form.Item
          name="has_partners"
          label="同行人"
          rules={[
            {
              required: true,
              message: '请输入是否有同行人!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入是否有同行人' />
        </Form.Item>
        <Form.Item
          name="partnerts_relation"
          label="同行人关系"
          // rules={[
          //   {
          //     required: true,
          //     message: '请输入同行人关系!',
          //     whitespace: true,
          //   },
          // ]}
        >
          <Input placeholder='请输入同行人关系' />
        </Form.Item>
        <Form.Item
          name="vehicle"
          label="交通方式"
          rules={[
            {
              required: true,
              message: '请输入交通方式!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入交通方式' />
        </Form.Item>
        <Form.Item
          name="has_agreed_safety_commitment"
          label="安全承诺"
          rules={[
            {
              required: true,
              message: '请输入是否同意安全承诺!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入是否同意安全承诺' />
        </Form.Item>
        <Form.Item
          name="has_agreed_antiepidemic_commitment"
          label="防疫承诺"
          rules={[
            {
              required: true,
              message: '请输入是否同意防疫承诺!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入是否同意防疫承诺' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/reservation_info')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReservationInfoAdd;