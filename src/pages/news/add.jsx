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
import { reqAddNews, reqSchoolByRealname } from '../../api';
import storageUtils from '../../utils/storageUtils';

// 添加新闻组件
const NewsAdd = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>添加新闻</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const AddNews = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);
    // 2. 得到当前登录用户
    const admin = storageUtils.getAdmin(); 

    let real_publisher = '';
    // 3. 通过登录的学校管理员姓名查询所在学校
    if(admin.role_id === '1'){
      real_publisher = admin.realname;
    }else{
      const result = await reqSchoolByRealname(admin.realname);
      console.log(result.data);
      real_publisher = result.data[0].school[1];
    }

    // 4. 得到新闻主题
    const { theme } = values;
    // 5. 生成新闻对象
    const newsObj = {
      publisher: admin.role_id === '1' ? '系统管理员-' + real_publisher : real_publisher,
      pub_time: pub_time,
      pub_theme: theme,
      pub_content: editor.current? editor.current.getDetail():{}
    };

    console.log(newsObj);

    // 2. 提交添加的请求
    const result = await reqAddNews(newsObj);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加新闻成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到新闻列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至新闻列表页面
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
        onFinish={AddNews}
      >
        <Form.Item
          name="theme"
          label="新闻主题"
          rules={[
            {
              required: true,
              message: '请输入新闻主题!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入新闻主题' />
        </Form.Item>
        {/* <Form.Item label="图片">
          <PicturesWall ref={pw} imgs={imgs}/>
        </Form.Item> */}
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={''}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/news')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewsAdd;