import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const ShowPublishContent = (props) => {

  // 规定接收父元素的数据类型
  ShowPublishContent.propTypes ={
    detailTitle: PropTypes.string.isRequired,
    isShowPublishContent: PropTypes.bool.isRequired,
    contentDetail: PropTypes.object.isRequired,
    handleCloseShowPublishContentModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowPublishContentModal(false);
  };

  const { isShowPublishContent, contentDetail, detailTitle } = props;
  const { publisher, pub_realname, pub_time, pub_theme, pub_content } = contentDetail;

  return (
    <Modal
      title={detailTitle}
      visible={isShowPublishContent}
      onCancel={closeModal}
      footer={[]}
      style={{userSelect: 'true'}}
    >
      <h2 style={{fontSize:25+'px'}}>{pub_theme}</h2>
      <span dangerouslySetInnerHTML={{__html: pub_content}}></span>
      <div style={{position:'absolute', right:30+'px', bottom:20+'px'}}>
        <span>发布人：{publisher || pub_realname || '系统管理员'}</span> <br/>
        <span>发布时间：{pub_time}</span>
      </div>
    </Modal>
  );
};

export default ShowPublishContent;