export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.trim() === "")) {
    errors.push("필수 입력 항목입니다.");
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === "") {
    return { isValid: true, errors: [] };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`최소 ${rules.minLength}자 이상 입력해주세요.`);
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`최대 ${rules.maxLength}자까지 입력 가능합니다.`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push("올바른 형식이 아닙니다.");
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (data: Record<string, string>, rules: Record<string, ValidationRule>): ValidationResult => {
  const errors: string[] = [];
  let isValid = true;

  for (const [fieldName, fieldValue] of Object.entries(data)) {
    const fieldRules = rules[fieldName];
    if (fieldRules) {
      const result = validateField(fieldValue, fieldRules);
      if (!result.isValid) {
        isValid = false;
        errors.push(...result.errors.map(error => `${fieldName}: ${error}`));
      }
    }
  }

  return { isValid, errors };
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "올바른 이메일 형식이 아닙니다.";
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (value.length < 8) {
        return "비밀번호는 최소 8자 이상이어야 합니다.";
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return "소문자를 포함해야 합니다.";
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return "대문자를 포함해야 합니다.";
      }
      if (!/(?=.*\d)/.test(value)) {
        return "숫자를 포함해야 합니다.";
      }
      return null;
    }
  },
  phone: {
    pattern: /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/,
    custom: (value: string) => {
      if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(value)) {
        return "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)";
      }
      return null;
    }
  },
  tripTitle: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      if (value.length < 2) {
        return "여행 제목은 최소 2자 이상이어야 합니다.";
      }
      if (value.length > 50) {
        return "여행 제목은 최대 50자까지 입력 가능합니다.";
      }
      return null;
    }
  },
  tripDescription: {
    maxLength: 500,
    custom: (value: string) => {
      if (value.length > 500) {
        return "여행 설명은 최대 500자까지 입력 가능합니다.";
      }
      return null;
    }
  }
};

// Date validation
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!startDate || !endDate) {
    errors.push("시작일과 종료일을 모두 입력해주세요.");
    return { isValid: false, errors };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    errors.push("시작일은 오늘 이후여야 합니다.");
  }

  if (end < start) {
    errors.push("종료일은 시작일 이후여야 합니다.");
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    errors.push("여행 기간은 최대 30일까지 가능합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
