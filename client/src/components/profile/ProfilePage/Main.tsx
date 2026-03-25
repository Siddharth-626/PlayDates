import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sendPlayMatesRequest } from "@/utils/Playmates/sendPlaymatesRequest";
import { useProfile } from "@/context/profileContext";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { Loading } from "@/components/ui/Loading";
import { User, MapPin, Star, MessageCircle, UserPlus, UserCheck, Users } from "lucide-react";
import { SkillBasedTennisBallsUi } from "@/components/ui/SkillTennisBalls";
import { useChatDisplayData } from "@/context/chatDisplayDataContext";
import { createChat } from "@/utils/chat/CreateChat";
import { useRouter } from "next/router";

const SKILL_LABELS: Record<string, string> = {
  "1.0 - 1.5": "Beginner",
  "2.0 - 2.5": "Novice",
  "3.0 - 3.5": "Intermediate",
  "4.0 - 4.5": "Advanced",
  "5.0": "Expert",
};

const PlayerPage = ({ userId, profileId }: { userId: string; profileId: string }) => {
  const [player, setPlayer] = useState<any>(null);
  const [playmateStatus, setPlaymateStatus] = useState<"" | "pending" | "accepted">("");
  const { user } = useAuth();
  const { selectedProfile } = useProfile();
  const { setChatDisplayData } = useChatDisplayData();
  const router = useRouter();

  useEffect(() => {
    if (!profileId || !userId) return;
    const fetchPlayer = async () => {
      try {
        const data = await FetchPlayerProfile({ userUid: userId, profileId });
        setPlayer(data);
        // Check if already a playmate
        if (data && user?.uid && selectedProfile?.id) {
          const isPlaymate = data.playmates?.some(
            (p: any) => p.userUid === user.uid && p.profileId === selectedProfile.id
          );
          if (isPlaymate) setPlaymateStatus("accepted");
        }
      } catch {
        // silently fail
      }
    };
    fetchPlayer();
  }, [userId, profileId]);

  const handleAddPlaymate = async () => {
    if (!user?.uid || !selectedProfile?.id || !userId || !profileId) return;
    try {
      await sendPlayMatesRequest({
        fromUserUid: user.uid,
        fromProfileId: selectedProfile.id,
        toUserUid: userId,
        toProfileId: profileId,
      });
      setPlaymateStatus("pending");
    } catch {
      // silently fail
    }
  };

  const handleChatClick = async () => {
    const players = [
      { userUid: selectedProfile?.userUid, profileId: selectedProfile?.id, name: selectedProfile?.name, photoUrl: selectedProfile?.photoUrl },
      { userUid: player?.userUid, profileId: player?.id, name: player?.name, photoUrl: player?.photoUrl },
    ];
    const chatId = await createChat(players, "1-1", "", "");
    if (!chatId) return;
    setChatDisplayData({
      chatId,
      userUid: player.userUid,
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      type: "1-1",
    });
    router.push("/chats");
  };

  if (!player) return <Loading />;

  const skillLabel = player.skill ? SKILL_LABELS[player.skill] || player.skill : null;
  const preferencesList: string[] = player.preferences || [];
  const locationsList: any[] = player.locations || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto"
      aria-label="Player Profile"
    >
      {/* Hero card */}
      <div className="card rounded-2xl overflow-hidden mb-4">
        {/* Banner */}
        <div
          className="h-24 relative"
          style={{ background: "linear-gradient(135deg, var(--accent-green)30 0%, var(--surface-raised) 60%, var(--surface-overlay) 100%)" }}
        />

        {/* Avatar + basic info */}
        <div className="px-5 pb-5">
          {/* Avatar (overlapping banner) */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--card-bg)] bg-[var(--surface-inset)] flex items-center justify-center shadow-lg">
                {player.photoUrl ? (
                  <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-[var(--content-muted)]" />
                )}
              </div>
              {/* Online indicator */}
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[var(--card-bg)]"
                style={{ background: "var(--accent-green)" }}
              />
            </div>

            {/* Action buttons (top right) */}
            <div className="flex gap-2">
              <button
                onClick={handleChatClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--content-secondary)] text-[12px] font-semibold hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Chat
              </button>

              {playmateStatus === "" && (
                <button
                  onClick={handleAddPlaymate}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--accent-green)] text-white text-[12px] font-semibold hover:opacity-90 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Add
                </button>
              )}
              {playmateStatus === "pending" && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--accent-green)]/40 text-[var(--accent-green)] text-[12px] font-semibold opacity-70">
                  <UserCheck className="w-4 h-4" /> Requested
                </div>
              )}
              {playmateStatus === "accepted" && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[12px] font-semibold">
                  <UserCheck className="w-4 h-4" /> Playmate
                </div>
              )}
            </div>
          </div>

          {/* Name + details */}
          <div>
            <h2 className="font-outfit text-[20px] font-bold text-[var(--content-primary)] leading-tight">
              {player.name}
            </h2>
            {(player.age || player.gender) && (
              <p className="text-[13px] text-[var(--content-muted)] mt-0.5">
                {[player.age, player.gender].filter(Boolean).join(" · ")}
              </p>
            )}
            {player.skill && (
              <div className="mt-2">
                <SkillBasedTennisBallsUi skill={player.skill} />
              </div>
            )}
            {skillLabel && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span className="text-[13px] font-semibold text-[var(--accent-gold)]">{skillLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Preferred Courts */}
        <div className="card rounded-2xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-green)]/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[var(--accent-green)]" />
            </div>
            <span className="text-[13px] font-semibold text-[var(--content-primary)]">Preferred Courts</span>
          </div>
          {locationsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {locationsList.map((loc: any) => (
                <span
                  key={loc.courtId || loc.name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-inset)] text-[var(--content-secondary)] text-[12px] font-medium border border-[var(--border-subtle)]"
                >
                  <MapPin className="w-3 h-3 text-[var(--accent-green)]" />
                  {loc.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--content-muted)]">No preferred courts listed</p>
          )}
        </div>

        {/* Play Preferences */}
        <div className="card rounded-2xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-gold)]/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--accent-gold)]" />
            </div>
            <span className="text-[13px] font-semibold text-[var(--content-primary)]">Play Preferences</span>
          </div>
          {preferencesList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferencesList.map((pref: string) => (
                <span
                  key={pref}
                  className="px-2.5 py-1 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-[12px] font-semibold border border-[var(--accent-gold)]/20"
                >
                  {pref}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--content-muted)]">No preferences listed</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerPage;
