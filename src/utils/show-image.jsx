import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Image } from 'antd';

import { BASE_IMG_URL } from './constants';

const ShowImage = (props) => {

  // 规定接收父元素的数据类型
  ShowImage.propTypes ={
    isShowImage: PropTypes.bool.isRequired,
    current_click_item: PropTypes.any.isRequired, // 可能是String, 也可能是Array
    handleCloseShowImageModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowImageModal(false);
  };

  const { isShowImage, current_click_item } = props;

  console.log('666', current_click_item);

  return (
    <Modal
      title='详情'
      visible={isShowImage}
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
              <Image key={index} src={BASE_IMG_URL + item}></Image>
            );
          })
        )
      }
    </Modal>
  );
};

export default ShowImage;