import { renderHook, act } from '@testing-library/react-hooks';
import useAppState from './useAppState';

describe('useAppState()', () => {
  it('returns the initial state', () => {
    const initialState = { a: 'b' };
    const { result } = renderHook(() => useAppState(initialState, {}));

    const [state] = result.current;

    expect(state).toEqual(initialState);
  });

  it('invokes action functions with the current state and any params', () => {
    const initialState = { a: 'b' };
    const actions = {
      testAction: jest.fn(),
    };
    const { result } = renderHook(() => useAppState(initialState, actions));

    act(() => {
      const [state, dispatch] = result.current;
      dispatch({ type: 'testAction', params: [1, 2, 3] });
    });

    expect(actions.testAction).toHaveBeenCalledWith(initialState, 1, 2, 3);
  });

  it('updates the current state with the result of the action', () => {
    const initialState = { a: 'b' };
    const newState = { a: 'X' };
    const actions = {
      testAction: () => newState,
    };
    const { result } = renderHook(() => useAppState(initialState, actions));

    act(() => {
      const [state, dispatch] = result.current;
      dispatch({ type: 'testAction', params: [] });
    });

    const [state] = result.current;
    expect(state).toEqual(newState);
  });
});
