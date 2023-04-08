import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from '../../@types/studyUtilType';
import { getContextPath, pathJoin } from '../../study/util/studyUtil';
import Slider from './Slider';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

/**
 * 画像表示用スライダーモーダル
 * intervalは自動スライド間隔 null だと自動スライドしない
 *
 * @returns modalSlider
 */
const ModalSlider = ({
  title = null,
  imageList,
  setImage = null,
}: {
  title?: string;
  imageList: Image[];
  setImage?: (value: Image) => void;
}) => {
  const [index, setIndex] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = (e) => {
    if (setImage) setImage(imageList[index]);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        確認
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {title && <Modal.Title>Modal title</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={2}></Col>
              <Col md={8}>
                <Slider
                  imageList={imageList}
                  onSelect={setIndex}
                  indicators={false}
                />
              </Col>
              <Col md={2}></Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
          {setImage && (
            <Button variant="primary" onClick={handleSelect}>
              変更
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalSlider;
