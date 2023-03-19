import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useQuery } from "./urlParam";

/**
 *
 * @param fieldsToSearch - array of fields to search on
 * ["firstName", "lastName", "email", "preferredName"]
 */

const useSearch = (
  list: any[],
  fieldsToSearch: string[],
  relatedSearchField?: string
) => {
  const [searchInput, setSearchInput] = useState({
    value: "",
    isActive: false,
    typing: false,
  });

  const history = useHistory();
  const match = useRouteMatch();

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str,
      typing: true,
    });
  };

  const filterBySearchQuery = (searchQuery?: string, customFields?: any[]) => {
    if (searchQuery) {
      let searchVal = searchQuery.toLowerCase();
      const currentUsersList = [...list];
      const newList = currentUsersList.filter((item) => {
        // Search on firstName, lastName, email, and prefferred name for match.

        return (customFields || fieldsToSearch).some((fieldName) =>
          item[fieldName]?.toLowerCase().includes(searchVal)
        );
      });
      return newList;
    }
    return [];
  };

  const findRelatedSearch = (searchQuery: string) => {
    if (relatedSearchField) {
      let clone = [...list];
      let arrOfSearchQuery = searchQuery.split("");

      let withCount = clone.map((_c) => {
        let count = 0;
        let test: any = [];
        arrOfSearchQuery.forEach((_s) => {
          let isTrue = _c[relatedSearchField]?.toLowerCase().includes(_s);
          if (isTrue) {
            count++;
          }
        });
        return { ..._c, count: count > 4 ? count : 0, test };
      });

      return withCount.sort((a, b) => b.count - a.count)[0];
    } else {
      console.error("add relatedSearchField to useSearch hook");
      if (typeof relatedSearchField === "string") {
        return { [relatedSearchField]: "" };
      }
    }
  };

  const removeSearchAction = (
    cb?: () => void | null,
    navigateSearchQuery: boolean = true
  ) => {
    if (cb && typeof cb === "function") {
      cb?.();
    }
    navigateSearchQuery && history.push(`${match.url}`);
    setSearchInput({ value: "", isActive: false, typing: false });
  };

  const checkSearchQueryFromUrl = () => {
    const searchParams = useQuery(location.search);
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchInput({
        value: searchQuery,
        isActive: true,
        typing: false,
      });
      return searchQuery;
    }
    return "";
  };

  const searchAndFilter = (
    searchQuery: string,
    navigateSearchQuery: boolean = true
  ) => {
    const query = searchQuery || searchInput.value;
    if (query) {
      navigateSearchQuery && history.push(`${match.url}?search=${query}`);

      setSearchInput({
        ...searchInput,
        isActive: true,
        typing: false,
      });
      return filterBySearchQuery(query);
    } else {
      removeSearchAction();
      return [];
    }
  };

  return {
    filterBySearchQuery,
    removeSearchAction,
    searchInput,
    checkSearchQueryFromUrl,
    setSearchInput,
    setSearch,
    searchAndFilter,
    findRelatedSearch,
  };
};

export default useSearch;
