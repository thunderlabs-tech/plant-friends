import useAppState, { ActionDispatchers } from "./useAppState";
import LoadingState from "./LoadingState";

export type Collection<Elem> = {
  data: Elem[];
  loadingState: LoadingState;
  dispatch: CollectionDispatchers<Elem>;
};

export default function useCollection<Elem>(
  initialData: Elem[] = [],
  loadingState: LoadingState = LoadingState.notYetLoaded,
): Collection<Elem> {
  const actionHandlers: CollectionActionFns<Elem> = {
    setData: (state, data: Elem[]) => ({ ...state, data }),
    setLoadingState: (state, loadingState: LoadingState) => ({
      ...state,
      loadingState: loadingState,
    }),
  };

  const [state, dispatch] = useAppState(
    { data: initialData, loadingState },
    actionHandlers,
  );

  // TODO: this is neat but performance will probably suffer because the returned object identity will always change
  return {
    ...state,
    dispatch,
  };
}

export type CollectionState<Elem> = {
  data: Elem[];
  loadingState: LoadingState;
};

type CollectionActionFns<Elem> = {
  setData: (
    state: CollectionState<Elem>,
    data: Elem[],
  ) => CollectionState<Elem>;
  setLoadingState: (
    state: CollectionState<Elem>,
    loadingState: LoadingState,
  ) => CollectionState<Elem>;
};

export type CollectionDispatchers<Elem> = ActionDispatchers<
  CollectionState<Elem>,
  CollectionActionFns<Elem>
>;

// export type UpdateElement<Elem> = Collection<Elem>['dispatch']['updateElement'];
