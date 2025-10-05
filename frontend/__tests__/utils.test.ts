import { validateField, validateForm } from '@/utils/validation';
import { formatDate, formatDateRange, parseDate } from '@/utils/date';
import { debounce, throttle } from '@/utils/performance';
import { 
  saveToLocalStorage, 
  getFromLocalStorage, 
  removeFromLocalStorage,
  clearLocalStorage 
} from '@/utils/storage';

describe('Utils Tests', () => {
  describe('Validation Utils', () => {
    describe('validateField', () => {
      it('should validate required field', () => {
        const result = validateField('', { required: true });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('필수 입력 항목입니다.');
      });

      it('should validate min length', () => {
        const result = validateField('ab', { minLength: 3 });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('최소 3자 이상 입력해주세요.');
      });

      it('should validate max length', () => {
        const result = validateField('abcdefghijk', { maxLength: 10 });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('최대 10자까지 입력 가능합니다.');
      });

      it('should validate email format', () => {
        const result = validateField('invalid-email', { type: 'email' });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('올바른 이메일 형식이 아닙니다.');
      });

      it('should validate phone format', () => {
        const result = validateField('123', { type: 'phone' });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('올바른 전화번호 형식이 아닙니다.');
      });

      it('should validate custom pattern', () => {
        const result = validateField('abc', { pattern: /^[0-9]+$/, message: '숫자만 입력 가능합니다.' });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('숫자만 입력 가능합니다.');
      });

      it('should return valid for correct input', () => {
        const result = validateField('test@example.com', { type: 'email' });
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('validateForm', () => {
      it('should validate entire form', () => {
        const formData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };

        const validationRules = {
          email: { required: true, type: 'email' },
          password: { required: true, minLength: 8 },
          confirmPassword: { required: true, match: 'password' }
        };

        const result = validateForm(formData, validationRules);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
      });

      it('should return errors for invalid form', () => {
        const formData = {
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456'
        };

        const validationRules = {
          email: { required: true, type: 'email' },
          password: { required: true, minLength: 8 },
          confirmPassword: { required: true, match: 'password' }
        };

        const result = validateForm(formData, validationRules);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBeDefined();
        expect(result.errors.password).toBeDefined();
        expect(result.errors.confirmPassword).toBeDefined();
      });
    });
  });

  describe('Date Utils', () => {
    describe('formatDate', () => {
      it('should format date correctly', () => {
        const date = new Date('2024-01-15');
        const formatted = formatDate(date);
        expect(formatted).toBe('2024.01.15');
      });

      it('should format date with custom format', () => {
        const date = new Date('2024-01-15');
        const formatted = formatDate(date, 'YYYY-MM-DD');
        expect(formatted).toBe('2024-01-15');
      });
    });

    describe('formatDateRange', () => {
      it('should format date range correctly', () => {
        const startDate = new Date('2024-01-15');
        const endDate = new Date('2024-01-17');
        const formatted = formatDateRange(startDate, endDate);
        expect(formatted).toBe('2024.01.15 - 2024.01.17');
      });
    });

    describe('parseDate', () => {
      it('should parse date string correctly', () => {
        const dateString = '2024-01-15';
        const parsed = parseDate(dateString);
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed.getFullYear()).toBe(2024);
        expect(parsed.getMonth()).toBe(0); // January is 0
        expect(parsed.getDate()).toBe(15);
      });
    });
  });

  describe('Performance Utils', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('debounce', () => {
      it('should debounce function calls', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(mockFn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('throttle', () => {
      it('should throttle function calls', () => {
        const mockFn = jest.fn();
        const throttledFn = throttle(mockFn, 100);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(mockFn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Storage Utils', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    describe('saveToLocalStorage', () => {
      it('should save data to localStorage', () => {
        const key = 'test-key';
        const data = { name: 'test', value: 123 };

        saveToLocalStorage(key, data);

        const saved = localStorage.getItem(key);
        expect(saved).toBe(JSON.stringify(data));
      });

      it('should handle string data', () => {
        const key = 'test-string';
        const data = 'test value';

        saveToLocalStorage(key, data);

        const saved = localStorage.getItem(key);
        expect(saved).toBe('"test value"');
      });
    });

    describe('getFromLocalStorage', () => {
      it('should get data from localStorage', () => {
        const key = 'test-key';
        const data = { name: 'test', value: 123 };

        localStorage.setItem(key, JSON.stringify(data));

        const retrieved = getFromLocalStorage(key);
        expect(retrieved).toEqual(data);
      });

      it('should return null for non-existent key', () => {
        const retrieved = getFromLocalStorage('non-existent');
        expect(retrieved).toBeNull();
      });

      it('should return default value for non-existent key', () => {
        const defaultValue = { default: true };
        const retrieved = getFromLocalStorage('non-existent', defaultValue);
        expect(retrieved).toEqual(defaultValue);
      });
    });

    describe('removeFromLocalStorage', () => {
      it('should remove data from localStorage', () => {
        const key = 'test-key';
        const data = { name: 'test' };

        localStorage.setItem(key, JSON.stringify(data));
        expect(localStorage.getItem(key)).toBeTruthy();

        removeFromLocalStorage(key);
        expect(localStorage.getItem(key)).toBeNull();
      });
    });

    describe('clearLocalStorage', () => {
      it('should clear all data from localStorage', () => {
        localStorage.setItem('key1', 'value1');
        localStorage.setItem('key2', 'value2');

        expect(localStorage.length).toBe(2);

        clearLocalStorage();

        expect(localStorage.length).toBe(0);
      });
    });
  });
});
