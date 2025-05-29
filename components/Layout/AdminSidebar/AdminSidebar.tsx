// components/layout/Sidebar.tsx
import Link from "next/link";

export default function AdminSidebar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <aside className={`${className} bg-gray-900 text-white p-4`}>
      <nav className="space-y-3">
        <Link href="/">Dashboard</Link>
        <Link href="/admin/consoles">Consoles</Link>
        <Link href="/admin/games">Games</Link>
        <Link href="/admin/accessories">Acessórios</Link>
      </nav>
    </aside>
  );
}
