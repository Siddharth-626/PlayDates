import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { respondToMatchPreposal } from "@/utils/MatchPreposal/respondToMAtchPreposal";
import toast from "react-hot-toast";
import { DisplayMatch } from "./displayMatch";
import { useState } from "react";
import { CreateMatch } from "./CreateMatch";
import { Button } from "@headlessui/react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { FiGlobe } from "react-icons/fi";

export const DisplayMatches = ({ matches }: { matches: any[] | undefined }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [isTabOpen, setTabOpen] = useState(false);

    const handleMatchPreposalResponse = async (status: string, matchId: string) => {
        if (!user?.uid || !selectedProfile?.id || !matchId) return;

        await respondToMatchPreposal({
            matchId,
            userUid: user.uid,
            profileId: selectedProfile.id,
            status,
        });

        toast.success(status === "accepted" ? "Match accepted!" : "Match rejected.");
        setTabOpen(false);
    };
    const CloseTab = () => {
        setTabOpen(false);
    }
    if (!matches) return;
    return (
        <div className="space-y-4 animate-fade-in">
            <div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTabOpen(prev => !prev)}
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-2 rounded-xl font-semibold shadow transition-all flex items-center gap-2"
                >
                    {isTabOpen ? (
                        <>
                            <X size={18} /> Close
                        </>
                    ) : (
                        <>
                            <FiGlobe size={18} /> Create Match
                        </>
                    )}
                </motion.button>
            </div>
            {isTabOpen ? (<div>
                <CreateMatch CloseTab={CloseTab} />
            </div>) : (<div>
                <h1 className="text-bold text-black dark:text-white font-bold text-2xl">Matches</h1>
                <div className="space-y-2">
                    {matches.length === 0 ? (
                        <p className="text-gray-500">No matches.</p>
                    ) : (
                        matches.map((match: any) => (
                            <div
                                key={match.id}
                                className={`p-4 rounded-lg transition-all duration-300`}
                            >
                                <DisplayMatch match={match} onRespond={handleMatchPreposalResponse} />
                            </div>
                        ))
                    )}
                </div>
            </div>
            )}

        </div>
    );
}