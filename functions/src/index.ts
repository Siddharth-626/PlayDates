
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
setGlobalOptions({ region: 'asia-south1' });


import { clearOldAvailability } from "./Availability/clearoldAvailability";
import { preposeMatch } from "./matchPreposal/matchPreposl";
import { AddProposedMatchToNotification } from "./matchPreposal/AddPreposedMatchToNotification";
import { changeStatusOfMatch } from "./matchPreposal/ChangeStatusOffMatch";
export {changeStatusOfMatch};
export { preposeMatch }
export { clearOldAvailability }
export {AddProposedMatchToNotification};

