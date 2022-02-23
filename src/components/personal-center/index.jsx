/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Modal,
  Input,
  Form,
} from 'antd';

import memoryUtils from '../../utils/memoryUtils.js';
// import { ALL_SCHOOL_LIST} from '../../utils/school-list.js';

export default class PersonalCenter extends Component {
        
    closeModal = () => {
      this.props.handleClosePersonalCenterModal(false);
    }

    render() {

      const formItemLayout = {
        labelCol: { span: 6 },  // 左侧label的宽度
        wrapperCol: { span: 14 }, // 右侧包裹的宽度
      };

      const { isShowPersonalCenter, LoginAdminInfo } = this.props;

      // console.log('666', LoginAdminInfo);
      const { username, realname, ID_number, school = [] } = LoginAdminInfo[0] || {};

      // console.log(school);

      return ( // 根据role_id判断是系统管理员还是学校管理员
        memoryUtils.admin.role_id === '2' ? (
          <Modal
            title='个人中心'
            visible={isShowPersonalCenter}
            onCancel={() => {
              this.closeModal();
            }}
            footer={[]}  // 去掉 '取消'、'确认' 按钮
          >
            <Form
              {...formItemLayout}
            >
              <Form.Item
                name="username"
                label="手机号"
              >
                <Input
                  disabled
                  placeholder={username}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
              <Form.Item
                name="realname"
                label="姓名"
              >
                <Input 
                  placeholder={realname} 
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="ID_number"
                label="身份证号"
              >
                <Input 
                  placeholder={ID_number} 
                  disabled
                />
              </Form.Item>

              <Form.Item 
                name="school"
                label="您的学校"
              >
                <Input 
                  placeholder={school[1]} 
                  disabled
                />
              </Form.Item>
              <h1 style={{fontSize:20+'px',paddingLeft:9+'%',paddingTop:2+'%'}}>若需修改以上关键信息，请联系系统管理员！</h1>
            </Form>
          </Modal>
        ) : (
          <Modal
            title='个人中心'
            visible={isShowPersonalCenter}
            onCancel={() => {
              this.closeModal();
            }}
            footer={[]}  // 去掉 '取消'、'确认' 按钮
          >
            <Form
              {...formItemLayout}
            >
              <Form.Item
                name="username"
                label="手机号"
              >
                <Input
                  disabled
                  placeholder={username}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
              <Form.Item
                name="realname"
                label="姓名"
              >
                <Input 
                  placeholder={realname} 
                  disabled
                />
              </Form.Item>
            </Form>
          </Modal>
        )
      );
    }
}
