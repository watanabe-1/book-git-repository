import React, { useCallback, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

import { Image } from '../../../../@types/studyUtilType';
import { pathJoin } from '../../../../study/util/studyStringUtil';
import { getContextPath } from '../../../../study/util/studyUtil';

type SliderProps = {
  /** 画像リスト */
  imageList: Image[];
  /** 自動スライド間隔 null だと自動スライドしない */
  interval?: number;
  /** 選択対象セット用ハンドラー関数 */
  onSelect?: (eventKey: number, event: Record<string, unknown>) => void;
  /** インジケーターを追加するかどうか */
  indicators?: boolean;
  /** 開始index */
  startIndex?: number;
};

/**
 * 画像表示用スライダー
 *
 * @returns slider
 */
const Slider: React.FC<SliderProps> = ({
  imageList,
  interval = null,
  onSelect = null,
  indicators = true,
  startIndex = 0,
}) => {
  const [index, setIndex] = useState(startIndex);

  const handleSelect = useCallback(
    (selectedIndex: number, event: Record<string, unknown>) => {
      setIndex(selectedIndex);
      onSelect?.(selectedIndex, event);
    },
    [setIndex, onSelect]
  );

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      interval={interval}
      variant="dark"
      indicators={indicators}
    >
      {imageList.map((image) => {
        return (
          <Carousel.Item key={image.imgId}>
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
