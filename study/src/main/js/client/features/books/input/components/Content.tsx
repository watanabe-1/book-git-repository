import React, { Suspense, useCallback, useState } from 'react';
import Col from 'react-bootstrap/Col';

import InputForm from './InputForm';
import Result from './Result';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import Stepper from '../../../../components/elements/stepper/Stepper';
import BodysHead from '../../../../components/layout/BodysHead';

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
  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  return (
    <div>
      <BodysHead title={steps[activeStep]} />
      <Col md="7" lg="8">
        <Stepper steps={steps} activeStep={activeStep}></Stepper>
        <Suspense fallback={<BodysLodingSpinner />}>
          {getStepContent(activeStep, handleNext, handleBack, handleReset)}
        </Suspense>
      </Col>
    </div>
  );
};

export default Content;
