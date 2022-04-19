/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  Input,
  Button,
  Form,
  Radio
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';
import RichTextEditor from '../../utils/rich-text-editor';
import { reqUpdateMessage } from '../../api';

// 修改用户消息组件
const MessageUpdate = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改用户消息信息</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateMessage = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);

    // 2. 得到输入的内容
    const { publisher, acceptor, isRead } = values;
   
    // 4. 生成意见反馈对象
    const newMessageObj = {
      publisher,
      acceptor,
      pub_time,
      pub_content: editor.current? editor.current.getDetail():{},
      isRead
    };

    console.log(newMessageObj);

    // 2. 提交添加的请求
    const messageId = props.history.location.state._id;  // 得到当前行用户消息的id
    const result = await reqUpdateMessage({newMessageObj, messageId});
    console.log(result);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('修改用户消息成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到用户消息列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至用户消息列表页面
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

  // 得到回显的 messageObj
  const messageObj = props.history.location.state;
  const { 
    publisher,
    acceptor, 
    pub_content,
    isRead
  } = messageObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateMessage}
        initialValues={{  // 为表单类input输入框设置初始默认值
          publisher,
          acceptor, 
          isRead
        }}
      >
        <Form.Item
          name="publisher"
          label="发布人"
          rules={[
            {
              required: true,
              message: '请输入发布人!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入发布人(学校名称或系统管理员)' />
        </Form.Item><Form.Item
          name="acceptor"
          label="接收人"
          rules={[
            {
              required: true,
              message: '请输入接收人手机号!',
              whitespace: true,
            },
            {
              pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, 
              message:'输入接收人的手机号格式错误!'
            },
          ]}
        >
          <Input placeholder='请输入接收人的手机号' />
        </Form.Item>
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={pub_content[0]}/>
        </Form.Item>
        <Form.Item
          name="isRead"
          label="是否已读"
          rules={[
            {
              required: true,
              message: '请用户消息是否已读!',
              whitespace: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value='1'>已读</Radio.Button>
            <Radio.Button value='0'>未读</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/message')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MessageUpdate;