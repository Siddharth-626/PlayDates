import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { respondToMatchPreposal } from "@/utils/MatchPreposal/respondToMAtchPreposal";
import toast from "react-hot-toast";
import { DisplayMatchePreposal } from "./displayPreposedMatch";

export const DisplayMatches =({matches}:{matches:any[] | undefined})=>{
    const {user} = useAuth();
    const {selectedProfile} = useProfile();
    const handleMatchPreposalResponse = async (status: string, matchId: string) => {
        if (!user?.uid || !selectedProfile?.id || !matchId) return;

        await respondToMatchPreposal({
            matchId,
            userUid: user.uid,
            profileId: selectedProfile.id,
            status,
        });

        toast.success("You accepted the Match Proposal");
    };
    if(!matches) return;
    return(
            <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                {matches.length === 0 ? (
                    <p className="text-gray-500">No matches.</p>
                ) : (
                    matches.map((match: any) => (
                        <div
                            key={match.id}
                            className={`p-4 rounded-lg transition-all duration-300`}
                        >
                            <DisplayMatchePreposal match={match} onRespond={handleMatchPreposalResponse} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}