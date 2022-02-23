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
import { reqAddAnnouncement, reqSchoolByRealname } from '../../api';
import storageUtils from '../../utils/storageUtils';

// 添加公告组件
const AnnouncementAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加公告</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddAnnouncement = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    // 2. 得到当前登录用户
    const admin = storageUtils.getAdmin(); 

    let real_publisher = '';
    // 3. 通过登录的学校管理员姓名查询所在学校
    if(admin.role_id === '1'){
      real_publisher = admin.realname;
    }else{
      const result = await reqSchoolByRealname(admin.realname);
      real_publisher = result.data[0].school[1];
    }

    // 3. 得到公告主题
    const { theme } = values;
    // 4. 生成公告对象
    const announcementObj = {
      publisher: admin.role_id === '1' ? '系统管理员-' + real_publisher : real_publisher,
      pub_time: pub_time,
      pub_theme: theme,
      pub_content: editor.current? editor.current.getDetail():{}
    };

    console.log(announcementObj);

    // 2. 提交添加的请求
    const result = await reqAddAnnouncement(announcementObj);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加公告成功！');
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

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={AddAnnouncement}
      >
        <Form.Item
          name="theme"
          label="公告主题"
          rules={[
            {
              required: true,
              message: '请输入公告主题!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入公告主题' />
        </Form.Item>
        {/* <Form.Item label="图片">
          <PicturesWall ref={pw} imgs={imgs}/>
        </Form.Item> */}
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={''}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/announcement')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AnnouncementAdd;