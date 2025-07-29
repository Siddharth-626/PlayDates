
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: 'asia-south1' });


import { clearOldAvailability } from "./Availability/clearoldAvailability";
import { preposeMatch } from "./matchPreposal/matchPreposl";
import { AddProposedMatchToProfile } from "./matchPreposal/AddPreposedMatchToMatches";
import { changeStatusOfMatch } from "./matchPreposal/ChangeStatusOffMatch";
import { clearOldNotification } from "./notifications/clearOldNotification";


export {clearOldNotification}
export {changeStatusOfMatch};
export { preposeMatch }
export { clearOldAvailability }
export {AddProposedMatchToProfile};

