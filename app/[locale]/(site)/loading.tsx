import { Spinner } from "@/components/atoms/Spinner/Spinner";

// Global loading for the (site) segment: shows during route transitions
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Spinner variant="primary" size={48} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando…</p>
      </div>
    </div>
  );
}
