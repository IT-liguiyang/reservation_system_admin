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
import { reqUpdateReservationInfo } from '../../api';
import PicturesWall from '../../utils/pictures-wall';

// 添加预约信息组件
const ReservationInfoUpdate = (props) => {

  const image = React.createRef();  // 得到头像上传对象

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改预约信息信息</span>
    </span>
  );

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateReservationInfo = async (values) => {
    // 1. 得到当前时间作为提交时间
    const submit_time = moment().format('YYYY-MM-DD HH:mm'); 
    console.log(submit_time);
 
    // 2. 得到输入的值
    const { 
      res_realname, 
      res_username, 
      res_school_name, 
      res_school_id, 
      res_date, 
      res_place, 
      res_time,
      vehicle,
      status, 
    } = values;
 
    // 3. 生成预约信息对象
    const reservation_infoObj = {
      res_realname,
      res_username, 
      res_avater: image.current? image.current.getImgs():{}, 
      res_school_name, 
      res_school_id, 
      res_date, 
      res_place, 
      res_time,
      vehicle,
      status, 
      submit_time,
      comment: [],
    };
 
    console.log(reservation_infoObj);
 
    const reservation_infoId = props.history.location.state._id;  // 得到当前行公告的id
    // 4. 提交添加的请求
    const result = await reqUpdateReservationInfo({reservation_infoObj, reservation_infoId});
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('修改预约信息成功！');
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

  // 得到回显的 reservation_infoObj
  const reservation_infoObj = props.history.location.state;
  const {  // 对象的省略写法 res_realname: res_realname, 写成 res_realname
    res_realname, 
    res_username, 
    res_avater, 
    res_school_name, 
    res_school_id, 
    res_date, 
    res_place, 
    res_time,
    vehicle,
    status,   
  } = reservation_infoObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateReservationInfo}
        initialValues={{  // 为表单类input输入框设置初始默认值，对象的省略写法
          res_realname, 
          res_username, 
          res_avater, 
          res_school_name, 
          res_school_id, 
          res_date, 
          res_place, 
          res_time,
          vehicle,
          status, 
        }}
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
        <Form.Item 
          label="头像"
          rules={[
            {
              required: true,
              message: '请上传图片!',
            },
          ]}
        >
          <PicturesWall ref={image} imgs={res_avater}/>
        </Form.Item>
        <Form.Item
          name="res_school_name"
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
          name="res_school_id"
          label="学校编号"
          rules={[
            {
              required: true,
              message: '请输入已约学校编号!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约学校编号' />
        </Form.Item>
        <Form.Item
          name="res_date"
          label="已约日期"
          rules={[
            {
              required: true,
              message: '请输入已约日期!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约日期（如 2022-01-01 ）' />
        </Form.Item>
        <Form.Item
          name="res_place"
          label="已约场馆"
          rules={[
            {
              required: true,
              message: '请输入已约场馆!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约场馆' />
        </Form.Item>
        <Form.Item
          name="res_time"
          label="已约时段"
          rules={[
            {
              required: true,
              message: '请输入已约时段!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入已约时段' />
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
          name="status"
          label="预约状态"
          rules={[
            {
              required: true,
              message: '请输入预约状态!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入预约状态' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' style={{marginLeft:70+'px'}} htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/reservation_info')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReservationInfoUpdate;