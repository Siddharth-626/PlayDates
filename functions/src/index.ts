
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: 'asia-south1' });


import { clearOldAvailability } from "./Availability/clearoldAvailability";
import { preposeMatch } from "./match/matchPreposal/matchPreposl";
import { AddProposedMatchToProfile } from "./match/common/AddPreposedMatchToMatches";
import { changeStatusOfMatch } from "./match/common/ChangeStatusOffMatch";
import { clearOldNotification } from "./notifications/clearOldNotification";
import { clearOldProfileMatches } from "./match/common/clearOldProfileMatches";
import { ChangeStatusOffProfileMatches } from "./match/MatchCreation/ChangeStatusOffProfileMatches";

export {ChangeStatusOffProfileMatches};
export {clearOldProfileMatches}
export {clearOldNotification}
export {changeStatusOfMatch};
export { preposeMatch }
export { clearOldAvailability }
export {AddProposedMatchToProfile};

