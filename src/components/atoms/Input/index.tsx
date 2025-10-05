import React, { forwardRef, useState } from "react";
import { validateField, ValidationRule } from "@/utils/validation";
import "./styles.css";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onFocus'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "default" | "filled" | "outlined";
  validation?: ValidationRule;
  showValidation?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconClick,
    size = "medium",
    variant = "default",
    validation,
    showValidation = true,
    as = "input",
    rows = 3,
    className = "",
    onChange,
    onBlur,
    onFocus: onFocusProp,
    ...props
  }, ref) {
    const [validationError, setValidationError] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (validation && showValidation) {
        const result = validateField(e.target.value, validation);
        setValidationError(result.errors[0] || "");
      }
      onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };


    const hasError = Boolean(error || validationError);
    const displayError = error || validationError;

    const inputClasses = `
      input
      input-${size}
      input-${variant}
      ${hasError ? "input-error" : ""}
      ${isFocused ? "input-focused" : ""}
      ${leftIcon ? "input-with-left-icon" : ""}
      ${rightIcon ? "input-with-right-icon" : ""}
      ${className}
    `.trim();

    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label">
            {label}
            {validation?.required && <span className="input-required">*</span>}
          </label>
        )}
        
        <div className="input-container">
          {leftIcon && (
            <div className="input-icon-left">
              {leftIcon}
            </div>
          )}
          
          {as === "textarea" ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={inputClasses}
              onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
              onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                setIsFocused(true);
                onFocusProp?.(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>);
              }}
              onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                setIsFocused(false);
                if (validation && showValidation) {
                  const result = validateField(e.target.value, validation);
                  setValidationError(result.errors[0] || "");
                }
                onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>);
              }}
              rows={rows}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={inputClasses}
              onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                setIsFocused(true);
                onFocusProp?.(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>);
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                setIsFocused(false);
                if (validation && showValidation) {
                  const result = validateField(e.target.value, validation);
                  setValidationError(result.errors[0] || "");
                }
                onBlur?.(e);
              }}
              {...props}
            />
          )}
          
          {rightIcon && (
            <div 
              className={`input-icon-right ${onRightIconClick ? "clickable" : ""}`}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(displayError || helperText) && (
          <div className="input-message">
            {displayError && (
              <span className="input-error-text">{displayError}</span>
            )}
            {helperText && !displayError && (
              <span className="input-helper-text">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);