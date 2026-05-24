import { USERS_SEARCH_DEBOUNCE_MS } from '@core/constants';
import type { UserDTO } from '@core/dto';
import { getUsersWithFiltersService } from '@core/services';
import { debounce } from '@core/utils';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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

  const debouncedFetchRef = useRef(
    debounce(fetchUsers, USERS_SEARCH_DEBOUNCE_MS), // eslint-disable-line react-hooks/refs
  );

  useEffect(() => {
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      debouncedFetchRef.current(value);
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
