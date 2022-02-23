/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Modal,
  Input,
  Form,
  Button,
  message
} from 'antd';
import './index.less';
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import { reqLogin } from '../../api';
import { reqUpdatePassword } from '../../api';

export default class ChangePassword extends Component {
        
    closeModal = () => {
      this.props.handleCloseChangePasswordModal(false);
    }

    changePassword = async (values) => {
      const admin = storageUtils.getAdmin(); 
      // console.log(admin.username);
      // console.log('Received values of form: ', values);
      const { oldPassword, password } = values;
      const result = await reqLogin(admin.username, oldPassword, admin.role_id); 
      // console.log('11111', result);
      if (result.status === 0) {  // 原密码正确
        const result1 = await reqUpdatePassword(admin.username, password, admin.role_id); 
        if (result1.status === 0) {  // 修改密码成功
          message.success(result1.msg);
          this.closeModal();
          // 删除保存的admin数据
          storageUtils.removeAdmin();
          memoryUtils.admin = {};

          // 跳转到login
          setTimeout(() => {
            this.props.logoutAfterChangePassord();
          }, 3000);
        }
        if (result1.status === 1) {
          message.error(result1.msg);
        }
      } else if(result.status===1) {
        message.error('原密码错误，请重试！');
      } else {
        message.error('修改密码, 请重新尝试！');
      }
    };

    render() {

      const formItemLayout = {
        labelCol: { span: 6 },  // 左侧label的宽度
        wrapperCol: { span: 14 }, // 右侧包裹的宽度
      };

      const { isShowChangePassword } = this.props;

      return (
        <Modal
          title='修改密码'
          visible={isShowChangePassword}
          onCancel={() => {
            this.closeModal();
          }}
          // onOk={this.handleChangePassword}
          footer={[]}
        >
          <Form
            {...formItemLayout}
            onFinish={this.changePassword}
          >
            <Form.Item
              name="oldPassword"
              label="原密码"
            >
              <Input.Password
                // disabled
                placeholder='请输入原密码'
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="新密码"
              rules={[
                {
                  required: true,
                  message: '请输入新密码',
                },
                {
                  pattern:/^[a-zA-Z][a-zA-Z0-9_]{8,12}$/, 
                  message:'8-12位, 字母开头且仅由字母,数字,下划线组成'
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder='请输入您的新密码' />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请再次输入您的新密码!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('您两次输入的密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder='请再次输入您的新密码' />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-button">
                            确定
              </Button>
              <Button type="primary" onClick={this.closeModal} className="cancel-button">
                            取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
}
