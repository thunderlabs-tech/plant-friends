import mapValues from "lodash/mapValues";
import { useState, useReducer } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type ActionFnType<State> = {
  [Key: string]: (currentState: State, ...X: any) => State;
};

type OmitFirstArg<F extends (...args: any) => any> = F extends (
  firstArg: any,
  ...args: infer Params
) => infer R
  ? (...args: Params) => R
  : never;

type ReducerActionObjects<State, ActionFns extends ActionFnType<State>> = {
  [Key in keyof ActionFns]: {
    type: Key;
    params: Parameters<OmitFirstArg<ActionFns[Key]>>;
  };
}[keyof ActionFns];

type RemoveReturnType<T extends (...args: any) => any> = (
  ...a: Parameters<T>
) => void;

type ExternalActionFn<
  State,
  ActionFn extends (currentState: State, ...restArgs: any) => any
> = RemoveReturnType<OmitFirstArg<ActionFn>>;

export type ActionDispatchers<State, Actions extends ActionFnType<State>> = {
  [Key in keyof Actions]: ExternalActionFn<State, Actions[Key]>;
};

function makeActionDispatchers<State, ActionFns extends ActionFnType<State>>(
  handlers: ActionFns,
  dispatch: React.Dispatch<ReducerActionObjects<State, ActionFns>>,
): ActionDispatchers<State, ActionFns> {
  return mapValues(handlers, (actionFn, actionName) => {
    const externalAction: ExternalActionFn<State, typeof actionFn> = (
      ...params
    ) => {
      dispatch({
        type: actionName,
        params,
      });
    };
    return externalAction;
  });
}

export default function useAppState<
  State,
  ActionFns extends ActionFnType<State>
>(
  initialState: State,
  initialActionHandlers: ActionFns,
): [State, ActionDispatchers<State, ActionFns>] {
  const [handlers] = useState(initialActionHandlers);

  function reducer(
    currentState: State,
    action: ReducerActionObjects<State, ActionFns>,
  ): State {
    const handler = handlers[action.type];
    if (!handler) throw new Error(`Unrecognized action ${action.type}`);
    return handler(currentState, ...action.params);
  }

  const [internalState, dispatch] = useReducer(reducer, initialState); // TODO support lazy initialization

  const [actionDispatchers] = useState(() =>
    makeActionDispatchers<State, ActionFns>(handlers, dispatch),
  );

  return [internalState, actionDispatchers];
}
