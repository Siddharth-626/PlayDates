import { db } from "@/services/config"
import { doc, runTransaction } from "firebase/firestore"


export const handleScoreSubmit = async (
    score: Record<string, any>,
    matchId: string,
    userUid?: string,
) => {
    if (!matchId || typeof matchId !== "string") {
        throw new Error("Invalid matchId");
    }
    if (!score || typeof score !== "object") {
        throw new Error("Invalid score data");
    }

    const matchRef = doc(db, "matches", matchId);

    await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(matchRef);
        if (!snap.exists()) throw new Error("Match not found");

        const data = snap.data();

        // Verify submitter is a match participant (if userUid provided)
        if (userUid) {
            const isParticipant = Array.isArray(data.players) &&
                data.players.some((p: any) => p.userUid === userUid);
            if (!isParticipant) throw new Error("Not a match participant");
        }

        // Verify match has ended
        const endTime = data.endTime?.toDate?.() ?? (data.endTime ? new Date(data.endTime) : null);
        if (endTime && endTime.getTime() > Date.now()) {
            throw new Error("Match has not ended yet");
        }

        // Prevent duplicate score submission
        if (data.score) {
            throw new Error("Score already submitted");
        }

        transaction.update(matchRef, {
            score,
            status: "completed",
        });
    });
}
