/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Radio
} from 'antd';

import LinkButton from '../../components/link-button';
import PicturesWall from '../../utils/pictures-wall';
import RichTextEditor from '../../utils/rich-text-editor';

import { reqUpdateSchool } from '../../api';

// 更新学校信息组件
const SchoolUpdate = (props) => {
  const schoolObj = props.location.state || {};  // 获取一行学校对象 schoolObj
  
  const { 
    _id,
    school, 
    image,
    telephone, 
    address, 
    longitude, 
    latitude,
    trafficGuidance,
    openTimeInfoStr,
    openAreasInfoStr,
    schoolIntroduce,
    reservationNotice,
    openBooking
  } = schoolObj;

  const schoolId = _id;
  console.log(schoolObj,_id);

  const formElement = useRef(null);

  const imageUpload = React.createRef();  // 得到图片上传对象
  const school_introduceText = React.createRef();  // 得到 学校介绍 富文本输入框对象
  const reservation_noticeText = React.createRef();  // 得到 预定须知 富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}>
      </LinkButton>
      <span>修改学校信息</span>
    </span>
  );

  const UpdateSchool = async (values) => {
    const { 
      telephone, 
      address, 
      longitude, 
      latitude,
      openTimeInfoStr,
      openAreasInfoStr,
      trafficGuidance,
      openBooking
    } = values;

    // 1. 生成学校对象
    const schoolObj = {
      'school': [school[0],school[1]],  // 将'区域/学校名称'构造为['区域','学校名称']数组
      'image': imageUpload.current? imageUpload.current.getImgs():{},
      'telephone': telephone,
      'address': address,
      'longitude': longitude,
      'latitude': latitude,
      'trafficGuidance': trafficGuidance,
      'openTimeInfoStr': openTimeInfoStr,
      'openAreasInfoStr': openAreasInfoStr,
      'schoolIntroduce': school_introduceText.current? school_introduceText.current.getDetail():{},
      'reservationNotice': reservation_noticeText.current? reservation_noticeText.current.getDetail():{},
      'openBooking': openBooking
    };

    // 2. 提交添加的请求
    const result = await reqUpdateSchool({schoolObj, schoolId});
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('修改学校信息成功！');
      Modal.confirm({
        title: '跳转到学校列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack();
        },
        onCancel() {
          formElement.current.resetFields();
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
        onFinish={UpdateSchool}
        ref={formElement}
        initialValues={{
          'school': school[0] + '/' + school[1],
          telephone, 
          address, 
          longitude, 
          latitude,
          trafficGuidance,
          openTimeInfoStr,
          openAreasInfoStr,
          openBooking
        }}
      >
        <Form.Item
          name="school"
          label="学校"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item 
          label="学校图片"
        >
          <PicturesWall ref={imageUpload} imgs={image}/>
        </Form.Item>
        <Form.Item
          name="telephone"
          label="联系电话"
          rules={[
            {
              required: true,
              message: '请输入学校联系电话!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入学校联系电话' />
        </Form.Item>
        <Form.Item
          name="address"
          label="学校地址"
          rules={[
            {
              required: true,
              message: '请输入学校地址!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入学校地址' />
        </Form.Item>
        <Form.Item
          name="longitude"
          label="经度"
          rules={[
            {
              required: true,
              message: '请输入所在位置的经度!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入所在位置的经度' />
        </Form.Item>
        <Form.Item
          name="latitude"
          label="纬度"
          rules={[
            {
              required: true,
              message: '请输入所在位置的纬度!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入所在位置的纬度' />
        </Form.Item>
        <Form.Item
          name="trafficGuidance"
          label="交通指引"
        >
          <Input.TextArea placeholder='请输入学校交通指引' />
        </Form.Item>
        <Form.Item
          name="openTimeInfoStr"
          label="开放时间"
          rules={[
            {
              required: true,
              message: '请输入学校开发时间!',
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea placeholder='请输入学校开发时间' />
        </Form.Item>
        <Form.Item
          name="openAreasInfoStr"
          label="开放区域"
          rules={[
            {
              required: true,
              message: '请输入学校开放区域!',
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea placeholder='请输入学校开放区域' />
        </Form.Item>
        <Form.Item label="学校介绍" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={school_introduceText} detail={schoolIntroduce}/>
        </Form.Item>
        <Form.Item label="预约须知" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={reservation_noticeText} detail={reservationNotice}/>
        </Form.Item>
        <Form.Item
          name="openBooking"
          label="可否预约"
          rules={[
            {
              required: true,
              message: '请选择学校是否可以预约!',
              whitespace: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="1">可以</Radio.Button>
            <Radio.Button value="0">不可以</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/school')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SchoolUpdate;