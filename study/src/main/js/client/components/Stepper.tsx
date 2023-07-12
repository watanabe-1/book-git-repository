import cn from 'classnames';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../../css/view/stepper/stepper.css';

type StepperProps = {
  /** ラベル 配列の要素分だけステップを作成 */
  steps: string[];
  /** 現在のstep */
  activeStep: number;
  /** ラベルを出すかどうか */
  noLabel?: boolean;
};

/**
 * ステッパー
 *
 * @returns stepper
 */
const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  noLabel = false,
}) => {
  return (
    <div className="pb-2 mb-5">
      <Row>
        <Col sm="12">
          <div className="form-bootstrapStepper">
            <ul className="bootstrapStepper form-wizard">
              {steps.map((label, index) => {
                const liClass = cn(
                  activeStep === index && 'active',
                  `col-sm-${Math.round(12 / steps.length)}`
                );
                return (
                  <li key={`bootstrapStepper-${index}`} className={liClass}>
                    <span className="step">{index + 1}</span>
                    {!noLabel && <span className="title">{label}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Stepper;
