import useAppState, {
  ActionDispatchers,
} from "src/utilities/state/useAppState";
import LoadingState from "src/utilities/state/LoadingState";

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
    replace: (state, element, newElement) => {
      const originalElementIndex = state.data.indexOf(element);

      if (originalElementIndex === -1)
        throw new Error("Can't replace element, not present in collection");

      const newElementsArray = state.data.slice(0);
      newElementsArray[originalElementIndex] = newElement;

      return {
        ...state,
        data: newElementsArray,
      };
    },
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
  replace: (
    state: CollectionState<Elem>,
    element: Elem,
    newElement: Elem,
  ) => CollectionState<Elem>;
};

export type CollectionDispatchers<Elem> = ActionDispatchers<
  CollectionState<Elem>,
  CollectionActionFns<Elem>
>;

// export type UpdateElement<Elem> = Collection<Elem>['dispatch']['updateElement'];
