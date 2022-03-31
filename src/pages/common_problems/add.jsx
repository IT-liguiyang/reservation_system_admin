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
import { reqAddCommonProblems } from '../../api';

// 添加常见问题组件
const CommonProblemsAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加常见问题</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddCommonProblems = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 

    // 2. 得到常见问题主题
    const { theme } = values;
    // 3. 生成常见问题对象
    const common_problemsObj = {
      pub_time: pub_time,
      pub_theme: theme,
      pub_content: editor.current? editor.current.getDetail():{}
    };

    console.log(common_problemsObj);

    // 4. 提交添加的请求
    const result = await reqAddCommonProblems(common_problemsObj);
    // 5. 更新列表显示
    if (result.status === 0) {
      message.success('添加常见问题成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到常见问题列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至常见问题列表页面
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
        onFinish={AddCommonProblems}
      >
        <Form.Item
          name="theme"
          label="主题"
          rules={[
            {
              required: true,
              message: '请输入常见问题主题!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入常见问题主题' />
        </Form.Item>
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={''}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/common_problems')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CommonProblemsAdd;