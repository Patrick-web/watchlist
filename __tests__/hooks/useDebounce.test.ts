import { renderHook, act } from '@testing-library/react-native';
import useDebounce from '@/hooks/useDebounce.hook';

// Mock timers
jest.useFakeTimers();

describe('useDebounce Hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    test('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      
      expect(result.current).toBe('initial');
    });

    test('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      // Change value but don't advance timers
      rerender({ value: 'changed', delay: 500 });
      expect(result.current).toBe('initial'); // Should still be initial

      // Advance timers by less than delay
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(result.current).toBe('initial'); // Should still be initial

      // Advance timers past delay
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(result.current).toBe('changed'); // Should now be changed
    });

    test('should reset timer on rapid value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // Change value multiple times rapidly
      rerender({ value: 'change1', delay: 500 });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      rerender({ value: 'change2', delay: 500 });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      rerender({ value: 'final', delay: 500 });

      // Value should still be initial since timer keeps resetting
      expect(result.current).toBe('initial');

      // Advance full delay from last change
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('final');
    });
  });

  describe('Delay Variations', () => {
    test('should work with different delay values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      );

      rerender({ value: 'changed', delay: 1000 });

      // Should not change after 500ms
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('initial');

      // Should change after full 1000ms
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('changed');
    });

    test('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      rerender({ value: 'changed', delay: 0 });

      // Should change immediately with zero delay
      act(() => {
        jest.runAllTimers();
      });
      expect(result.current).toBe('changed');
    });

    test('should handle changing delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      rerender({ value: 'changed', delay: 500 });

      // Advance part way
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Change delay
      rerender({ value: 'changed', delay: 1000 });

      // Original timer should be cleared, new timer with new delay should start
      act(() => {
        jest.advanceTimersByTime(500); // Total 800ms from original change
      });
      expect(result.current).toBe('initial'); // Should still be initial

      act(() => {
        jest.advanceTimersByTime(500); // Now 1000ms from delay change
      });
      expect(result.current).toBe('changed');
    });
  });

  describe('Value Types', () => {
    test('should work with numbers', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 0, delay: 500 } }
      );

      rerender({ value: 42, delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe(42);
    });

    test('should work with booleans', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: false, delay: 500 } }
      );

      rerender({ value: true, delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe(true);
    });

    test('should work with objects', () => {
      const initialObj = { name: 'initial' };
      const changedObj = { name: 'changed' };

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: initialObj, delay: 500 } }
      );

      rerender({ value: changedObj, delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe(changedObj);
    });

    test('should work with arrays', () => {
      const initialArray = ['a', 'b'];
      const changedArray = ['c', 'd'];

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: initialArray, delay: 500 } }
      );

      rerender({ value: changedArray, delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe(changedArray);
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: undefined, delay: 500 } }
      );

      rerender({ value: 'defined', delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('defined');
    });

    test('should handle null values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: null, delay: 500 } }
      );

      rerender({ value: 'not null', delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('not null');
    });

    test('should handle empty string', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: '', delay: 500 } }
      );

      rerender({ value: 'not empty', delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('not empty');
    });

    test('should handle same value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'same', delay: 500 } }
      );

      rerender({ value: 'same', delay: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('same');
    });
  });

  describe('Timer Cleanup', () => {
    test('should cleanup timer on unmount', () => {
      const { unmount, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      rerender({ value: 'changed', delay: 500 });

      // Unmount before timer completes
      unmount();

      // Advance timers - should not cause any issues
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // No assertions needed - test passes if no errors thrown
    });

    test('should cleanup previous timer when value changes', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      rerender({ value: 'change1', delay: 500 });
      rerender({ value: 'change2', delay: 500 });

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Multiple Instances', () => {
    test('should handle multiple independent debounce hooks', () => {
      const { result: result1, rerender: rerender1 } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'hook1', delay: 300 } }
      );

      const { result: result2, rerender: rerender2 } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'hook2', delay: 700 } }
      );

      rerender1({ value: 'changed1', delay: 300 });
      rerender2({ value: 'changed2', delay: 700 });

      // Advance by 300ms - first hook should update
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result1.current).toBe('changed1');
      expect(result2.current).toBe('hook2'); // Should still be original

      // Advance by another 400ms - second hook should update
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(result1.current).toBe('changed1');
      expect(result2.current).toBe('changed2');
    });
  });

  describe('Performance', () => {
    test('should not create new timers unnecessarily', () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      const initialSetTimeoutCalls = setTimeoutSpy.mock.calls.length;

      // Rerender with same value and delay - should not create new timer
      rerender({ value: 'initial', delay: 500 });

      expect(setTimeoutSpy).toHaveBeenCalledTimes(initialSetTimeoutCalls);
      expect(clearTimeoutSpy).not.toHaveBeenCalled();

      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });
  });
});