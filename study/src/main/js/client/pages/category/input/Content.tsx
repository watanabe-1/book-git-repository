import React, { useState, createContext } from 'react';
import Col from 'react-bootstrap/Col';

import Basic from './Basic';
import Confirm from './Confirm';
import Result from './Result';
import {
  Category,
  CategoryUi,
  FormConfirmData,
} from '../../../../@types/studyUtilType';
import BodysHead from '../../../components/BodysHead';
import Stepper from '../../../components/Stepper';

type CategoryInput = {
  form: Category;
  confirm: FormConfirmData[];
  info: CategoryUi;
};

export const Context = createContext<{
  currentState: CategoryInput;
  setCurrentState: React.Dispatch<React.SetStateAction<CategoryInput>>;
} | null>(null);

const steps = [
  'カテゴリー情報登録フォーム',
  'カテゴリー情報確認',
  'カテゴリー情報登録完了',
];

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
  const [currentState, setCurrentState] = useState<CategoryInput>({
    form: null,
    confirm: null,
    info: null,
  });
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
