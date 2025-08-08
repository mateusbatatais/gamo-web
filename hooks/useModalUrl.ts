import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function useModalUrl(modalId: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get("modal") === modalId;

  const openModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modalId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
}
