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
        console.log("New Availability:", availabilityData);
        if (!availabilityData) return;

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

        for (const doc of OpenMatchSnap.docs) {
            const match = doc.data();
            console.log("Checking Match:", match);

            // Build object compatible with isTimeOverlap
            const matchInfo = {
                date: match.date, // Timestamp is fine, parseDateTime handles it
                time: typeof match.startTime === "string"
                    ? match.startTime
                    : match.startTime?.toDate
                        ? match.startTime.toDate().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                        : "00:00",
                duration: typeof match.duration === "string"
                    ? match.duration
                    : match.duration?.value || "60 min" // fallback if stored differently
            };
            console.log(matchInfo, availabilityData);


            const matchRef = db.doc(`matches/${doc.id}`);

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

            console.log("locationMatch:", locationMatch, "preferenceMatch:", preferenceMatch, "dateMatch:", dateMatch);

            if (dateMatch && preferenceMatch && locationMatch) {
                if (isTimeOverlap(matchInfo, availabilityData)) {
                    if (match.players.length < playerCap) {
                        await matchRef.update({
                            players: admin.firestore.FieldValue.arrayUnion({
                                userUid,
                                profileId,
                                status: "pending",
                            }),
                        });

                        if (match.players.length + 1 >= playerCap) {
                            await matchRef.update({
                                status: "created",
                            });
                            console.log("Match full, status updated");
                        }

                        console.log("Player Added");
                    }
                }
            }
        }
    }
);
