export default function AboutSection({ about }: { about: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-1 text-green-700 dark:text-green-300">About</h3>
      <p className="text-gray-600 dark:text-gray-300">{about || "No bio provided."}</p>
    </div>
  );
}
