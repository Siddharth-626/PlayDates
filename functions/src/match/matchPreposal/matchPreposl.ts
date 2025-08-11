import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";
import { LocationStorageType, PlayersType } from "../../utils/Type";
import { PlayersBasedOnPrefernce } from "../../utils/PlayersBasedOnPrefernce";
import { getCommonTime, isTimeOverlap } from "../../utils/ChekIfTimeOverlap";

const db = admin.firestore();

export const preposeMatch = onDocumentCreated(
    {
        document: "users/{userUid}/profile/{profileId}/availability/{availabilityId}",
        region: "asia-south1",
    },
    async (event) => {
        try {

            const { userUid, profileId } = event.params;

            const currentUserAvailability = event.data?.data();

            if (!currentUserAvailability) return

            const currentUserProfileLocations: string[] =
                currentUserAvailability.locations?.map((loc: LocationStorageType) => loc.courtId) || [];

            const profileRef = db.doc(`users/${userUid}/profile/${profileId}`);
            const profileSnap = await profileRef.get();
            const profileData = profileSnap.data();
            if (!profileData?.playmates?.length) return;

            const players: PlayersType[] = [{ userUid, profileId, status: "pending" }];

            for (const playmate of profileData.playmates) {
                const { userUid: playmateUid, profileId: playmateProfileId } = playmate;

                const playmateAvailabilitySnap = await db
                    .collection(`users/${playmateUid}/profile/${playmateProfileId}/availability`)
                    .get();
                if (!playmateAvailabilitySnap) return;

                for (const doc of playmateAvailabilitySnap.docs) {
                    const playmateAvailability = doc.data();


                    if (!playmateAvailability?.locations || !playmateAvailability?.date) continue;

                    const playmateLocations: string[] =
                        playmateAvailability.locations.map((loc: LocationStorageType) => loc.courtId) || [];

                    const locationMatch = playmateLocations.some((courtId) =>
                        currentUserProfileLocations.includes(courtId)
                    );

                    const dateA = (
                        currentUserAvailability.date?.toDate?.() || currentUserAvailability.date
                    ).toDateString();

                    const dateB = (
                        playmateAvailability.date?.toDate?.() || playmateAvailability.date
                    ).toDateString();

                    const dateMatch = dateA === dateB;

                    const playmatePreferences = playmateAvailability.preference || [];
                    const currentUserPreferences = currentUserAvailability.preference || [];

                    const preference = currentUserPreferences.find((pref: string) =>
                        playmatePreferences.includes(pref)
                    );
                    console.log("locationMatch", locationMatch, "dateMatch", dateMatch, "prefence", preference);
                    if (locationMatch && dateMatch && preference) {

                        if (isTimeOverlap(currentUserAvailability, playmateAvailability)) {
                            if (players.length < 4) {
                                players.push({ userUid: playmateUid, profileId: playmateProfileId, status: "pending" });
                            }

                        }
                        let condition = false;
                        if (preference.toLocaleLowerCase().includes("doubles")) {
                            condition = players.length == 4;
                        }
                        else {
                            condition = players.length >= 2;
                        }
                        if (condition) {
                            const selectedPlayers = PlayersBasedOnPrefernce(preference, players);
                            if (!selectedPlayers) return;

                            const commonTime = getCommonTime(currentUserAvailability, playmateAvailability);
                            const matchProposal = {
                                players: selectedPlayers,
                                courtId: currentUserProfileLocations.find((courtId) =>
                                    playmateLocations.includes(courtId)
                                ),
                                date: currentUserAvailability.date,
                                startTime: commonTime?.startTime,
                                endTime: commonTime?.endTime,
                                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                status: "proposed",
                                MatchType: preference,
                            };

                            await db.collection("matches").add(matchProposal);
                            console.log("Proposed match successfully");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error while proposing match:", error);
        }
    }
);
