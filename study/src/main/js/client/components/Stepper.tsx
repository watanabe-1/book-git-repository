import { addRoundedRectPath } from 'chart.js/helpers';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../../css/view/stepper/stepper.css';

/**
 * stepsに渡した配列の要素分だけ作成
 * activeStepが現在のstep
 * noLable はラベルを出すかどうか
 * @returns stepper
 */
const Stepper = ({
  steps,
  activeStep,
  noLable = false,
}: {
  steps?: string[];
  activeStep?: number;
  noLable?: boolean;
}) => {
  return (
    <div className="pb-2 mb-5">
      <Row>
        <Col sm="12">
          <div className="form-bootstrapStepper">
            <ul className="bootstrapStepper form-wizard">
              {steps.map((label, index) => (
                <li
                  className={
                    (activeStep == index ? 'active' : '') +
                    ' col-sm-' +
                    Math.round(12 / steps.length)
                  }
                >
                  <span className="step">{index + 1}</span>
                  {!noLable ? <span className="title">{label}</span> : ''}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Stepper;
