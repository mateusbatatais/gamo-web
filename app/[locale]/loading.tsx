import { Spinner } from "@/components/atoms/Spinner/Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <div className="text-center">
        <Spinner variant="primary" size={48} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}
