import { useState, useReducer } from 'react';

type ParamsListWithoutFirstArg<Fn extends (...args: any) => any> = Fn extends (
  firstArg: any,
  ...args: infer Params
) => any
  ? Params
  : never;

type ReducerActionObjects<State, ActionFns extends { [Key: string]: (currentState: State, ...X: any) => State }> = {
  [Key in keyof ActionFns]: { type: Key; params: ParamsListWithoutFirstArg<ActionFns[Key]> };
}[keyof ActionFns];

export default function useAppState<
  State,
  ActionFns extends { [Key: string]: (currentState: State, ...X: any) => State }
>(
  initialState: State,
  initialActionHandlers: ActionFns
): [State, React.Dispatch<ReducerActionObjects<State, ActionFns>>] /*: [State, WrappedActions<State, ActionFns>] */ {
  const [handlers] = useState(initialActionHandlers);

  function reducer(currentState: State, action: ReducerActionObjects<State, ActionFns>): State {
    const handler = handlers[action.type];
    return handler(currentState, ...action.params);
  }

  const [internalState, dispatch] = useReducer(reducer, initialState); // TODO support lazy initialization

  return [internalState, dispatch];
}
