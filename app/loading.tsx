export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
