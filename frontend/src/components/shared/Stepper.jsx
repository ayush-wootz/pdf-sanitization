import React from "react";

/**
 * Stepper Component
 * Modern step navigation with visual progress indicators
 * 
 * @param {Array} steps - Array of step objects: [{id: number, label: string, enabled: boolean}]
 * @param {Number} currentStep - Currently active step (1-based)
 * @param {Function} onStepClick - Callback when step is clicked (stepId)
 */
export default function Stepper({ steps = [], currentStep = 1, onStepClick }) {
  return (
    <nav className="stepper" aria-label="Progress">
      <ol className="stepper-list">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isEnabled = step.enabled !== false;
          const isClickable = isEnabled && onStepClick;

          return (
            <li key={step.id} className="stepper-item">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`stepper-button ${
                  isCompleted ? "completed" : isActive ? "active" : "upcoming"
                } ${!isClickable ? "disabled" : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="stepper-circle">
                  {isCompleted ? (
                    // Checkmark for completed steps
                    <svg
                      className="stepper-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    // Number for active/upcoming steps
                    <span className="stepper-number">{step.id}</span>
                  )}
                </span>
                <span className="stepper-label">{step.label}</span>
              </button>

              {/* Connector Line (except after last step) */}
              {index < steps.length - 1 && (
                <div className="stepper-connector">
                  <div
                    className={`stepper-line ${
                      isCompleted ? "completed" : ""
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}