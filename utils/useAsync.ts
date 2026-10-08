import { DependencyList, useEffect, useState } from 'react';

/** Tiny data hook for repository calls. Ignores stale results when deps change. */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList, initial: T): { data: T; loading: boolean } {
  const [state, setState] = useState<{ data: T; loading: boolean }>({ data: initial, loading: true });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    fn()
      .then((data) => alive && setState({ data, loading: false }))
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
