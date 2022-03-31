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
import RichTextEditor from '../../utils/rich-text-editor';
import { reqAddOpinionsSuggestions } from '../../api';

// 添加意见建议组件
const OpinionsSuggestionsAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加意见建议</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddOpinionsSuggestions = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);

    // 2. 得到意见建议主题
    const { pub_realname, pub_username, pub_theme } = values;

    // 3. 生成意见建议对象
    const opinions_suggestionsObj = {
      pub_realname,
      pub_username,
      pub_time,
      pub_theme,
      pub_content: editor.current? editor.current.getDetail():{}
    };

    console.log(opinions_suggestionsObj);

    // 4. 提交添加的请求
    const result = await reqAddOpinionsSuggestions(opinions_suggestionsObj);
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('添加意见建议成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到意见建议列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至意见建议列表页面
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
        onFinish={AddOpinionsSuggestions}
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
        </Form.Item><Form.Item
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
          name="pub_theme"
          label="主题"
          rules={[
            {
              required: true,
              message: '请输入主题!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入主题' />
        </Form.Item>
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={''}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/opinions_suggestions')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OpinionsSuggestionsAdd;