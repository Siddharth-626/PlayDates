export const SkillBasedTennisBallsUi = ({ skill }: { skill: string }) => {
  if (!skill) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                     bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]
                     text-[11px] font-semibold leading-none">
      🎾 {skill}
    </span>
  );
};