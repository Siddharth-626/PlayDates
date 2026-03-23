import { onDocumentCreated } from "firebase-functions/firestore";
import { admin } from "../../utils/admin";
import { isTimeOverlap } from "../../utils/ChekIfTimeOverlap";
import { Timestamp } from "firebase-admin/firestore";

const db = admin.firestore();

export const AddPlayersToMatch = onDocumentCreated(
    {
        document:
            "users/{userUid}/profile/{profileId}/availability/{availabilityId}",
        region: "asia-south1",
    },
    async (event) => {
        const { userUid, profileId } = event.params;

        const availabilityData = event.data?.data();
        if (!availabilityData) {
            console.error("AddPlayersToMatch: no availability data in event");
            return;
        }

        console.log(`AddPlayersToMatch: processing availability for user=${userUid}, profile=${profileId}`);

        const date = availabilityData.date.toDate();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const startDateTime = Timestamp.fromDate(startOfDay);
        const endDateTime = Timestamp.fromDate(endOfDay);

        const OpenMatchSnap = await db
            .collection("matches")
            .where("status", "==", "open")
            .where("date", ">=", startDateTime)
            .where("date", "<=", endDateTime)
            .get();

        if (OpenMatchSnap.empty) {
            console.log("AddPlayersToMatch: no open matches found for this date");
            return;
        }

        // Fetch player profile once outside the loop
        const playerProfileSnap = await db.doc(`users/${userUid}/profile/${profileId}`).get();
        const playerProfileData = playerProfileSnap.data();
        if (!playerProfileData) {
            console.error(`AddPlayersToMatch: player profile not found for user=${userUid}, profile=${profileId}`);
            return;
        }

        for (const matchDoc of OpenMatchSnap.docs) {
            const match = matchDoc.data();
            const matchRef = db.doc(`matches/${matchDoc.id}`);

            // Skip matches without proper time data for overlap check
            if (!match.startTime || !match.endTime) continue;

            // Build object compatible with isTimeOverlap (needs startDate/endDate)
            const matchInfo = {
                startDate: match.startTime,
                endDate: match.endTime,
            };

            const dateMatch =
                match.date.toDate().toDateString() ===
                availabilityData.date.toDate().toDateString();

            const preferenceMatch = availabilityData.preference?.some(
                (pre: any) =>
                    pre.toLocaleLowerCase() === match.MatchType.toLocaleLowerCase()
            );

            const playerLocations = availabilityData.locations?.map(
                (loc: any) => loc.courtId
            );
            const locationMatch = playerLocations?.some(
                (loc: any) => loc === match.courtId
            );

            const playerCap = match.MatchType.toLocaleLowerCase().includes("singles")
                ? 2
                : 4;

            if (!dateMatch || !preferenceMatch || !locationMatch) continue;
            if (!isTimeOverlap(matchInfo, availabilityData)) continue;

            // Use a transaction to prevent race conditions when multiple players
            // try to join the same match simultaneously
            try {
                await db.runTransaction(async (transaction) => {
                    const freshSnap = await transaction.get(matchRef);
                    const freshMatch = freshSnap.data();
                    if (!freshMatch || freshMatch.status !== "open") return;

                    const currentPlayers = freshMatch.players || [];

                    // Check if player is already in the match
                    const alreadyInMatch = currentPlayers.some(
                        (p: any) => p.userUid === userUid && p.profileId === profileId
                    );
                    if (alreadyInMatch) {
                        console.log(`AddPlayersToMatch: player ${profileId} already in match ${matchDoc.id}`);
                        return;
                    }

                    if (currentPlayers.length >= playerCap) {
                        console.log(`AddPlayersToMatch: match ${matchDoc.id} already full`);
                        return;
                    }

                    const newPlayer = {
                        userUid,
                        profileId,
                        status: "pending",
                        name: playerProfileData.name || "",
                        photoUrl: playerProfileData.photoUrl || "",
                    };

                    const updatedPlayers = [...currentPlayers, newPlayer];
                    const updates: any = { players: updatedPlayers };

                    if (updatedPlayers.length >= playerCap) {
                        updates.status = "created";
                        console.log(`AddPlayersToMatch: match ${matchDoc.id} is now full, status → created`);
                    }

                    transaction.update(matchRef, updates);
                    console.log(`AddPlayersToMatch: added player ${profileId} to match ${matchDoc.id}`);
                });
            } catch (error) {
                console.error(`AddPlayersToMatch: transaction failed for match ${matchDoc.id}:`, error);
            }
        }
    }
);
