import useAppState from './useAppState';
import LoadedIndicator from './loadedIndicators';

export type Collection<Element> = { data: Element[]; loaded: LoadedIndicator };

export default function useCollection<Element>(initialData: Element[] = [], loaded: LoadedIndicator = 'notYetLoaded') {
  const [state, dispatch] = useAppState(
    {
      data: initialData,
      loaded,
    },
    {
      loaded: (state, data: Element[]) => ({ data, loaded: 'loaded' }),
      networkUnavailable: (state) => ({ ...state, loaded: 'networkUnavailable' }),
    }
  );
  return {
    ...state,
    dispatch,
  };
}
