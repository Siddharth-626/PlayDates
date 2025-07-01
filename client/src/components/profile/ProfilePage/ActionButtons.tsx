export default function ActionButtons({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onAdd}
        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
      >
        Add as my playmate
      </button>
      <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition">
        Chat
      </button>
      <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition">
        View Badges
      </button>
    </div>
  );
}