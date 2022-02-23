/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  // Input,
  Button,
  Form
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';
import RichTextEditor from '../../utils/rich-text-editor';
import { reqAddCommentDynamicSharing } from '../../api';
import storageUtils from '../../utils/storageUtils';
import { ALL_SCHOOL_LIST } from '../../utils/school-list';

// 添加动态分享组件
const DynamicSharingAddComment = (props) => {

  console.log('11111', props);

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加动态分享</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddCommentDynamicSharing = async () => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);
    // 2. 得到当前登录用户
    const admin = storageUtils.getAdmin(); 
    // 3. 判断是系统管理员还是学校管理员
    const { school } = admin;
    const schoolObj = school? ALL_SCHOOL_LIST.find( schoolObj => school[1] === schoolObj.value ):{};

    // // 4. 得到动态分享主题
    // const { theme } = values;
    // 4. 生成动态分享对象
    const dynamic_sharingObj = {
      publisher: school?schoolObj.label:'系统管理员',
      pub_time: pub_time,
      // pub_theme: theme,
      pub_content: editor.current? editor.current.getDetail():{},
      like_number:0
    };

    console.log(dynamic_sharingObj);

    // 2. 提交添加的请求
    const result = await reqAddCommentDynamicSharing(dynamic_sharingObj);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加动态分享成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到动态分享列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至动态分享列表页面
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
        onFinish={AddCommentDynamicSharing}
      >
        {/* <Form.Item
          name="theme"
          label="动态分享主题"
          rules={[
            {
              required: true,
              message: '请输入动态分享主题!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入动态分享主题' />
        </Form.Item> */}
        <Form.Item label="内容详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={''}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/dynamic_sharing')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DynamicSharingAddComment;