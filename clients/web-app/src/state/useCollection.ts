import useAppState, { ActionDispatchers } from './useAppState';
import LoadedIndicator from './LoadedIndicator';
import castAs from '../utilities/lang/castAs';

export type Collection<Elem> = {
  data: Elem[];
  loaded: LoadedIndicator;
  dispatch: CollectionDispatchers<Elem>;
};

export default function useCollection<Elem>(
  initialData: Elem[] = [],
  loaded: LoadedIndicator = 'notYetLoaded'
): Collection<Elem> {
  const actionHandlers: CollectionActionFns<Elem> = {
    loaded: (state, data: Elem[]) => ({ data, loaded: 'loaded' }),
    updateElement: (state, element: Elem, updated: Elem) => {
      const elementIndex = state.data.indexOf(element);
      if (elementIndex === -1)
        throw new Error('Element not present in collection. Only pass elements you got out of the collection');
      const newElements = [...state.data.slice(0, elementIndex), updated, ...state.data.slice(elementIndex + 1)];
      return { ...state, data: newElements };
    },
    networkUnavailable: (state) => ({ ...state, loaded: 'networkUnavailable' }),
  };

  const [state, dispatch] = useAppState({ data: initialData, loaded }, actionHandlers);

  // TODO: this is neat but performance will probably suffer because the returned object identity will always change
  return {
    ...state,
    dispatch,
  };
}

export type CollectionState<Elem> = {
  data: Elem[];
  loaded: LoadedIndicator;
};

type CollectionActionFns<Elem> = {
  loaded: (state: CollectionState<Elem>, data: Elem[]) => CollectionState<Elem>;
  networkUnavailable: (state: CollectionState<Elem>) => CollectionState<Elem>;
  updateElement: (state: CollectionState<Elem>, element: Elem, updated: Elem) => CollectionState<Elem>;
};

export type CollectionDispatchers<Elem> = ActionDispatchers<CollectionState<Elem>, CollectionActionFns<Elem>>;

export type UpdateElement<Elem> = Collection<Elem>['dispatch']['updateElement'];
