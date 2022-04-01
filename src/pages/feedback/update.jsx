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
import RichTextEditor from '../../utils/rich-text-editor';
import PicturesWall from '../../utils/pictures-wall';
import { reqUpdateFeedback } from '../../api';

// 添加公告组件
const FeedbackUpdate = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改公告信息</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象
  const imageUpload = React.createRef();  // 得到图片上传对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateFeedback = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);

    // 2. 得到输入的内容
    const { pub_realname, pub_username, type, acceptor } = values;
   
    // 4. 生成意见反馈对象
    const feedbackObj = {
      pub_realname,
      pub_username,
      type: type[0],
      acceptor,
      pub_time,
      pub_content: editor.current? editor.current.getDetail():{},
      image_list: imageUpload.current? imageUpload.current.getImgs():{},
    };

    console.log(feedbackObj);

    // 2. 提交添加的请求
    const feedbackId = props.history.location.state._id;  // 得到当前行公告的id
    const result = await reqUpdateFeedback({feedbackObj, feedbackId});
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('修改公告成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到公告列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至公告列表页面
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

  const typeOption = [
    {
      value: '功能异常',
      label: '功能异常',
    },
    {
      value: '服务态度',
      label: '服务态度',
    },
    {
      value: '设置安全',
      label: '设置安全',
    },
    {
      value: '其他',
      label: '其他',
    }
  ];

  // 得到回显的 feedbackObj
  const feedbackObj = props.history.location.state;
  const { 
    pub_realname, 
    pub_username, 
    acceptor, 
    image_list, 
    pub_content 
  } = feedbackObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateFeedback}
        initialValues={{  // 为表单类input输入框设置初始默认值
          pub_realname, 
          pub_username, 
          acceptor, 
        }}
      >
        <Form.Item
          name="pub_realname"
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
          name="pub_username"
          label="手机号"
          rules={[
            {
              required: true,
              message: '请输入您的手机号!',
              whitespace: true,
            },
            {
              pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
              message:'输入的手机号格式错误!'
            },
          ]}
        >
          <Input placeholder='请输入您的手机号' />
        </Form.Item>
        <Form.Item
          name="type"
          label="反馈类型"
          rules={[
            {
              required: true,
              message: '请选择反馈意见的类型!',
            }
          ]}
        >
          <Cascader 
            placeholder='请选择反馈意见的类型'
            options= {typeOption}
          />
        </Form.Item>
        <Form.Item
          name="acceptor"
          label="受理人"
          rules={[
            {
              required: true,
              message: '请输入反馈意见的受理人!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入反馈意见的受理人' />
        </Form.Item>
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={pub_content}/>
        </Form.Item>
        <Form.Item 
          label="学校图片"
        >
          <PicturesWall ref={imageUpload} imgs={image_list}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/feedback')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FeedbackUpdate;