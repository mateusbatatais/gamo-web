// components/layout/HeaderAdmin.tsx

export default function AdminHeader() {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <button className="text-red-500 hover:text-red-600">Logout</button>
    </header>
  );
}
