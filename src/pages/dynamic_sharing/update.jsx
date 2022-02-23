/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  message,
  Modal,
  Button,
  Form,
  Input
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button';
import RichTextEditor from '../../utils/rich-text-editor';
import { reqUpdateDynamicSharing, reqSchoolByRealname } from '../../api';
import storageUtils from '../../utils/storageUtils';

// 添加动态分享组件
const DynamicSharingUpdate = (props) => {

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}></LinkButton>
      <span>修改动态分享信息</span>
    </span>
  );

  const editor = React.createRef();  // 得到富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  const UpdateDynamicSharing = async (values) => {
    // 1. 得到当前时间
    const pub_time = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(pub_time);
    // 2. 得到当前登录用户
    const admin = storageUtils.getAdmin(); 
    
    // 3. 通过登录的学校管理员姓名查询所在学校
    let real_publisher = '';
    if(admin.role_id === '1'){
      real_publisher = admin.realname;
    }else{
      const result = await reqSchoolByRealname(admin.realname);
      console.log(result.data);
      real_publisher = result.data[0].school[1];
    }

    // 4. 得到点赞人数
    const { like_number } = values;

    // 4. 生成动态分享对象
    const dynamic_sharingObj = {
      publisher: admin.role_id === '1' ? '系统管理员-' + real_publisher : real_publisher,
      pub_time: pub_time,
      like_number: like_number,
      pub_content: editor.current? editor.current.getDetail():{}
    };

    console.log(dynamic_sharingObj);

    // 2. 提交添加的请求
    const dynamic_sharingId = props.history.location.state._id;  // 得到当前行动态分享的id
    const result = await reqUpdateDynamicSharing({dynamic_sharingObj, dynamic_sharingId});
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('修改动态分享成功！');
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

  // 得到回显的 dynamic_sharingObj
  const dynamic_sharingObj = props.history.location.state;
  const { like_number, pub_content } = dynamic_sharingObj || {};

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateDynamicSharing}
        initialValues={{  // 为表单类input输入框设置初始默认值
          'like_number': like_number,
        }}
      >
        <Form.Item
          name="like_number"
          label="点赞人数"
          rules={[
            {
              required: true,
              message: '请输入点赞人数!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入点赞人数' />
        </Form.Item>
        <Form.Item label="内容" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={pub_content[0]}/>  
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/dynamic_sharing')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DynamicSharingUpdate;