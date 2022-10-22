import React from 'react';
import Basic from './Basic';
import Confirm from './Confirm';
import Result from './Result';
export const Context = React.createContext(null);

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
  const [currentState, setCurrentState] = React.useState({});
  const value = {
    currentState,
    setCurrentState,
  };

  const [activeStep, setActiveStep] = React.useState(0);
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
      <Context.Provider value={value}>
        {getStepContent(activeStep, handleNext, handleBack, handleReset)}
      </Context.Provider>
    </div>
  );
};

export default Content;
