import { type ChangeEvent, useCallback, useRef, useState } from 'react';

import type { UserDTO } from '@/src/core/dto';
import { getUsersWithFiltersService } from '@/src/core/services';

const SEARCH_DEBOUNCE_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useUsersSearch() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isShowLoader, setIsShowLoader] = useState(false);

  const activeRequestIdRef = useRef(0);

  const runSearchForQuery = useCallback(async (query: string) => {
    const requestId = ++activeRequestIdRef.current;

    await sleep(SEARCH_DEBOUNCE_MS);
    if (requestId !== activeRequestIdRef.current) {
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setUsers([]);
      setIsShowLoader(false);
      return;
    }

    setIsShowLoader(true);
    try {
      const response = await getUsersWithFiltersService(trimmed);
      if (requestId !== activeRequestIdRef.current) {
        return;
      }
      setUsers(response.success && response.data ? response.data : []);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsShowLoader(false);
      }
    }
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      void runSearchForQuery(value);
    },
    [runSearchForQuery],
  );

  return {
    search,
    users,
    isShowLoader,
    handleSearchChange,
  };
}
