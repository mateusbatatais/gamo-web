import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useLocale } from "next-intl";

export interface ConsoleNote {
  id: number;
  consoleId: number;
  consoleSlug: string;
  consoleName: string;
  text: string;
}

export function useRandomConsoleNote() {
  const { apiFetch } = useApiClient();
  const locale = useLocale();

  return useQuery({
    queryKey: ["random-console-note", locale],
    queryFn: async () => {
      return await apiFetch<ConsoleNote | null>(`/consoles/notes/random?locale=${locale}`);
    },
    refetchOnWindowFocus: false,
  });
}
