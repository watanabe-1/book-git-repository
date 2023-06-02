import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

import { Image } from '../../@types/studyUtilType';
import { getContextPath, pathJoin } from '../../study/util/studyUtil';

/**
 * 画像表示用スライダー
 * intervalは自動スライド間隔 null だと自動スライドしない
 *
 * @returns slider
 */
const Slider = ({
  imageList,
  interval = null,
  onSelect = null,
  indicators = true,
}: {
  imageList: Image[];
  interval?: number;
  onSelect?: (eventKey: number, event: Record<string, unknown>) => void;
  indicators?: boolean;
}) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    if (onSelect) {
      onSelect(selectedIndex, e);
    }
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      interval={interval}
      variant="dark"
      indicators={indicators}
    >
      {imageList.map((image, i) => {
        return (
          <Carousel.Item key={`${image.imgId}-${i}`}>
            <img
              className="mh-100 mw-100"
              src={pathJoin(getContextPath(), image.imgPath, image.imgName)}
              alt={image.imgName}
            />
            <Carousel.Caption>
              <h5>{image.imgId}</h5>
              <p>{image.note}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default Slider;
