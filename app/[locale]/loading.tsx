import { Spinner } from "@/components/atoms/Spinner/Spinner";

// app/[locale]/loading.tsx
export default function LocaleLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}
