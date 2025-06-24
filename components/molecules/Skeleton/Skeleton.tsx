export function SkeletonCard({ height = "h-24" }: { height?: string }) {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 rounded bg-gray-300"></div>
          <div className="h-4 rounded bg-gray-300"></div>
        </div>
      </div>
      <div className={`mt-4 ${height} rounded bg-gray-300`}></div>
    </div>
  );
}
