import React, { useState, createContext, Suspense, useCallback } from 'react';
import Col from 'react-bootstrap/Col';
import { ErrorBoundary } from 'react-error-boundary';

import Basic from './Basic';
import Confirm from './Confirm';
import Result from './Result';
import {
  Category,
  FormConfirmData,
  CategoryUi,
} from '../../../../../@types/studyUtilType';
import ErrorModal from '../../../../components/elements/modal/ErrorModal';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import Stepper from '../../../../components/elements/stepper/Stepper';
import BodysHead from '../../../../components/layout/BodysHead';

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
        <ErrorBoundary FallbackComponent={ErrorModal}>
          <Suspense fallback={<BodysLodingSpinner />}>
            <Context.Provider value={value}>
              {getStepContent(activeStep, handleNext, handleBack, handleReset)}
            </Context.Provider>
          </Suspense>
        </ErrorBoundary>
      </Col>
    </div>
  );
};

export default Content;
