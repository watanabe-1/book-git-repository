import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

import BodysHead from '../../../components/BodysHead';
import Stepper from '../../../components/Stepper';
import InputForm from './InputForm';
import Result from './Result';

const steps = ['家計簿情報登録フォーム', '家計簿情報登録完了'];

/**
 * ステップ数に応じて画面を返却する
 *
 * @param stepIndex 数値
 * @param handleNext 次画面
 * @param handleBack 前画面
 * @param handleReset 最初の画面
 * @returns
 */
const getStepContent = (
  stepIndex: number,
  handleNext: () => void,
  handleBack: () => void,
  handleReset: () => void
) => {
  switch (stepIndex) {
    case 0:
      return <InputForm handleNext={handleNext} />;
    case 1:
      return <Result handleBack={handleReset} />;
    default:
      return 'Unknown stepIndex';
  }
};

const Content = () => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <BodysHead title={steps[activeStep]} />
      <Col md="7" lg="8">
        <Stepper steps={steps} activeStep={activeStep}></Stepper>
        {getStepContent(activeStep, handleNext, handleBack, handleReset)}
      </Col>
    </div>
  );
};

export default Content;
