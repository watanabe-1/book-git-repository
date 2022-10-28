import React, { useState, createContext } from 'react';
import Basic from './Basic';
import Confirm from './Confirm';
import Result from './Result';
import Stepper from '../../components/Stepper';
import BodysHead from '../../components/BodysHead';
import Col from 'react-bootstrap/Col';

export const Context = createContext(null);

const steps = [
  'カテゴリー情報登録フォーム',
  'カテゴリー情報確認',
  'カテゴリー情報登録完了',
];

const getStepContent = (stepIndex, handleNext, handleBack, handleReset) => {
  switch (stepIndex) {
    case 0:
      return <Basic handleNext={handleNext} />;
    case 1:
      return <Confirm handleNext={handleNext} handleBack={handleBack} />;
    case 2:
      return <Result handleBack={handleReset} />;
    default:
      return 'Unknown stepIndex';
  }
};

const Content = () => {
  const [currentState, setCurrentState] = useState({});
  const value = {
    currentState,
    setCurrentState,
  };

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
        <Context.Provider value={value}>
          {getStepContent(activeStep, handleNext, handleBack, handleReset)}
        </Context.Provider>
      </Col>
    </div>
  );
};

export default Content;
