import React from 'react'
import { Check } from 'lucide-react'

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                          ? 'bg-blue-600 border-blue-600 text-white scale-110'
                          : 'bg-gray-200 border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{stepNumber}</span>}
                </div>

                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={`
                      text-xs sm:text-sm font-medium
                      ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                    `}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle || step.title}</span>
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 -mt-8 transition-all duration-300
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                  style={{ maxWidth: '120px' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
