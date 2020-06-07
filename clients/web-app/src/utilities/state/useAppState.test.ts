import { renderHook, act } from "@testing-library/react-hooks";
import useAppState from "./useAppState";

describe("useAppState()", () => {
  it("returns the initial state", () => {
    const initialState = { a: "b" };
    const { result } = renderHook(() => useAppState(initialState, {}));

    const [state] = result.current;

    expect(state).toEqual(initialState);
  });

  it("invokes action functions with the current state and any params", () => {
    const initialState = { a: "b" };
    const handlers = {
      testAction1: jest.fn(),
    };
    const { result } = renderHook(() => useAppState(initialState, handlers));

    act(() => {
      const dispatchers = result.current[1];
      console.log("test 1");
      dispatchers.testAction1(1, 2, 3);
    });

    expect(handlers.testAction1).toHaveBeenLastCalledWith(
      initialState,
      1,
      2,
      3,
    );
  });

  it("updates the current state with the result of the action", () => {
    const initialState = { a: "b" };
    const newState = { a: "X" };
    const actions = {
      testAction: () => newState,
    };
    const { result } = renderHook(() => useAppState(initialState, actions));

    act(() => {
      const actions = result.current[1];
      actions.testAction();
    });

    const [state] = result.current;
    expect(state).toEqual(newState);
  });
});
