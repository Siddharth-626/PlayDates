export default function AboutSection({ about }: { about: string }) {
  return (
    <div>
      <h3 className="text-body font-semibold mb-2 text-[var(--content-primary)]">About</h3>
      <p className="text-body-sm text-[var(--content-secondary)]">{about || "No bio provided."}</p>
    </div>
  );
}
