import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Image } from 'antd';

const ShowContent = (props) => {

  // 规定接收父元素的数据类型
  ShowContent.propTypes ={
    isShowContent: PropTypes.bool.isRequired,
    current_click_item: PropTypes.any.isRequired, // 可能是String, 也可能是Array
    handleCloseShowContentModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowContentModal(false);
  };

  const { isShowContent, current_click_item } = props;

  const basicImgUrl = 'http://localhost:5000/upload/';

  return (
    <Modal
      title='详情'
      visible={isShowContent}
      onCancel={closeModal}
      footer={[]}
      style={{userSelect: 'true'}}
    >
      {
        typeof(current_click_item) === 'string'? (
          <span dangerouslySetInnerHTML={{__html: current_click_item}}></span>
        ):(
          current_click_item.map((item, index) => {
            return (
              <Image key={index} src={basicImgUrl+item}></Image>
            );
          })
        )
      }
    </Modal>
  );
};

export default ShowContent;