import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { UserDTO } from '@/src/core/dto';
import { getUsersWithFiltersService } from '@/src/core/services';
import { debounce } from '@/src/core/utils';

const SEARCH_DEBOUNCE_MS = 300;

export function useUsersSearch() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isShowLoader, setIsShowLoader] = useState(false);

  const activeRequestIdRef = useRef(0);

  const fetchUsers = useCallback(async (query: string) => {
    const trimmed = query.trim();
    const requestId = ++activeRequestIdRef.current;

    if (!trimmed) {
      setUsers([]);
      setIsShowLoader(false);
      return;
    }

    setIsShowLoader(true);

    try {
      const response = await getUsersWithFiltersService(trimmed);

      if (requestId !== activeRequestIdRef.current) return;

      setUsers(response.success && response.data ? response.data : []);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsShowLoader(false);
      }
    }
  }, []);

  const debouncedFetchRef = useRef(debounce(fetchUsers, SEARCH_DEBOUNCE_MS));

  useEffect(() => {
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      void debouncedFetchRef.current(value);
    },
    [],
  );

  return {
    search,
    users,
    isShowLoader,
    handleSearchChange,
  };
}
