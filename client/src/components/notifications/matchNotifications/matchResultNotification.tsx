import { CheckCircle, XCircle } from "lucide-react";

export const MatchResultNotification = ({ note }: { note: any }) => {
    const { message, type, isRead, status } = note;

    if (type !== "match preposal result" || isRead) return null;


    const isSuccess = status === "accepted";

    return (
        <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl p-4 shadow-md animate-fade-in-down transition-all duration-300  mx-auto">
            <div className="text-green-600 dark:text-green-300">
                {isSuccess ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div className="flex-1">
                <p className="text-lg md:text-xl font-semibold text-black dark:text-white">
                    {message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You’ve received a response to your match proposal.
                </p>
            </div>
        </div>
    );
};
