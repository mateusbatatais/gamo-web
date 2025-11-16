// hooks/useCatalogQueryKeys.ts
export const useCatalogQueryKeys = () => {
  const getQueryKey = (type: "games" | "consoles" | "accessories") => {
    return [`user${type.charAt(0).toUpperCase() + type.slice(1)}Public`];
  };

  return {
    getGamesQueryKey: () => getQueryKey("games"),
    getConsolesQueryKey: () => getQueryKey("consoles"),
    getAccessoriesQueryKey: () => getQueryKey("accessories"),
  };
};
