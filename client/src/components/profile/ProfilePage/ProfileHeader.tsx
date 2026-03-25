import { SkillBasedTennisBallsUi } from "@/components/ui/SkillTennisBalls";
import { PlayerProfile } from "@/utils/TYPE";
import { User } from "lucide-react";

export default function ProfileHeader({ profile }: { profile: PlayerProfile }) {
    return (
        <div className="text-center">
            {/* Gradient banner */}
            <div
                className="relative h-20 rounded-xl mb-12"
                style={{
                    background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface-overlay) 50%, var(--accent-green)20 100%)',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
            >
                {/* Avatar floating over banner */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="relative w-20 h-20">
                        {profile.photoUrl ? (
                            <img
                                src={profile.photoUrl}
                                className="rounded-full border-[3px] w-full h-full object-cover shadow-glow-green"
                                style={{ borderColor: 'var(--accent-green)' }}
                                alt={profile.name}
                            />
                        ) : (
                            <div
                                className="rounded-full border-[3px] w-full h-full flex items-center justify-center"
                                style={{ borderColor: 'var(--accent-green)', background: 'var(--surface-inset)' }}
                            >
                                <User className="w-8 h-8" style={{ color: 'var(--content-muted)' }} />
                            </div>
                        )}
                        {/* Online dot */}
                        <span
                            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 animate-notif-pulse"
                            style={{ background: 'var(--accent-green)', borderColor: 'var(--surface-raised)' }}
                        />
                    </div>
                </div>
            </div>
            <h2 className="font-outfit text-lg font-bold mt-2" style={{ color: 'var(--content-primary)' }}>{profile.name}</h2>
            <div className="flex justify-center mt-1 mb-1">
                <SkillBasedTennisBallsUi skill={profile.skill}/>
            </div>
        </div>
    );
}
