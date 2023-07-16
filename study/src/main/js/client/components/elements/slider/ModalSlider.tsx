import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import Slider from './Slider';
import { Image } from '../../../../@types/studyUtilType';

type ModalSliderChartProps = {
  /** タイトル */
  title?: string;
  /** 画像リスト */
  imageList: Image[];
  /** 選択したimageをセットするよう関数 */
  setImage?: (value: Image) => void;
  /** 開始index */
  startIndex?: number;
};

/**
 * 画像表示用スライダーモーダル
 * intervalは自動スライド間隔 null だと自動スライドしない
 *
 * @returns modalSlider
 */
const ModalSlider: React.FC<ModalSliderChartProps> = ({
  title = null,
  imageList,
  setImage = null,
  startIndex = 0,
}) => {
  const [index, setIndex] = useState(startIndex);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = () => {
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
          {title && <Modal.Title>{title}</Modal.Title>}
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
                  startIndex={index}
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
