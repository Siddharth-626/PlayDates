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
            console.log(`preposeMatch: triggered for user=${userUid}, profile=${profileId}`);


            const currentUserAvailability = event.data?.data();

            if (!currentUserAvailability) {
                console.error("preposeMatch: no availability data in event");
                return;
            }

            const currentUserProfileLocations: string[] =
                currentUserAvailability.locations?.map((loc: LocationStorageType) => loc.courtId) || [];

            const profileRef = db.doc(`users/${userUid}/profile/${profileId}`);
            const profileSnap = await profileRef.get();
            const profileData = profileSnap.data();
            if (!profileData?.playmates?.length) {
                console.log("preposeMatch: user has no playmates, skipping");
                return;
            }

            const players: PlayersType[] = [{ userUid, profileId, status: "pending", name: profileData.name,photoUrl:profileData.photoUrl }];
            for (const playmate of profileData.playmates) {
                const { userUid: playmateUid, profileId: playmateProfileId } = playmate;

                const playmateProfileSnap = await db.doc(`users/${playmateUid}/profile/${playmateProfileId}`).get()
                const playmateProfileData = playmateProfileSnap.data();

                const playmateAvailabilitySnap = await db
                    .collection(`users/${playmateUid}/profile/${playmateProfileId}/availability`)
                    .get();
                if (playmateAvailabilitySnap.empty) continue;

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
                    if (locationMatch && dateMatch && preference) {

                        if (isTimeOverlap(currentUserAvailability, playmateAvailability)) {
                            // Prevent duplicate: check if player is already added
                            const alreadyAdded = players.some(p => p.profileId === playmateProfileId);
                            if (!alreadyAdded && players.length < 4) {

                                players.push({ userUid: playmateUid, profileId: playmateProfileId, status: "pending", name: playmateProfileData?.name,photoUrl:playmateProfileData?.photoUrl});
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
                            if (!selectedPlayers) continue;

                            const courtId = currentUserProfileLocations.find((cid) =>
                                playmateLocations.includes(cid)
                            );

                            // Duplicate guard: check if a proposed match already exists
                            // for the same players, court, and date
                            const selectedIds = new Set(selectedPlayers.map(p => p.profileId));
                            const existingSnap = await db.collection("matches")
                                .where("status", "==", "proposed")
                                .where("courtId", "==", courtId)
                                .where("date", "==", currentUserAvailability.date)
                                .limit(50)
                                .get();

                            const isDuplicate = existingSnap.docs.some(d => {
                                const ep = d.data().players || [];
                                if (ep.length !== selectedPlayers.length) return false;
                                return ep.every((p: any) => selectedIds.has(p.profileId));
                            });

                            if (isDuplicate) {
                                console.log("preposeMatch: duplicate proposal detected, skipping");
                            } else {
                                const commonTime = getCommonTime(currentUserAvailability, playmateAvailability);
                                const matchProposal = {
                                    players: selectedPlayers,
                                    courtId,
                                    date: currentUserAvailability.date,
                                    startTime: commonTime?.startTime ?? null,
                                    endTime: commonTime?.endTime ?? null,
                                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                    status: "proposed",
                                    MatchType: preference,
                                    host: { userUid: "system", profileId: "system", name: "system" }
                                };

                                await db.collection("matches").add(matchProposal);
                                console.log(`preposeMatch: proposed match created with ${selectedPlayers.length} players, type=${preference}`);
                            }

                            // Reset players array to avoid bleeding into next iteration
                            players.length = 1;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("preposeMatch: error while proposing match:", error);
        }
    }
);
