import { Loading } from "@/components/ui/Loading";
import { usePlaymates } from "@/context/playmatesContext";
import { useProfile } from "@/context/profileContext";
import { Player, PlayerProfile } from "@/utils/TYPE";
import { Check, Search, User, Users, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";



type PlaymatePickerPropsType = {
    selected: any[];
    onChange: (selected: any[]) => void;
    numberOfPlayers: number;
    isAutoPlayerPickerSelected: boolean;
    OnAutoPlayerSelect: () => void;
    type:string;
};

export const PlaymatePicker = ({
    selected,
    onChange,
    numberOfPlayers,
    isAutoPlayerPickerSelected,
    OnAutoPlayerSelect,type
}: PlaymatePickerPropsType) => {
    const { selectedProfile } = useProfile();
    const { playmates, loading } = usePlaymates();
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (
            selectedProfile &&
            type == "match" &&
            !selected.some((s) => s.profileId === selectedProfile.id)
        ) {
            onChange([
                ...selected,
                {
                    profileId: selectedProfile.id,
                    userUid: selectedProfile.userUid,
                    status: "pending",
                    name:selectedProfile.name
                },
            ]);
        }
    }, [selectedProfile]);

    const isSelected = (playmateId: string) =>
        selected.some((val) => val.profileId === playmateId);

    const handleOnChange = (playmate: PlayerProfile) => {
        const alreadySelected = isSelected(playmate.id);

        if (alreadySelected) {
            onChange(selected.filter((val) => val.profileId !== playmate.id));
        } else {
            if (selected.length === numberOfPlayers) {
                toast.error("You can’t select more players");
                return;
            }
            onChange([
                ...selected,
                {
                    profileId: playmate.id,
                    userUid: playmate.userUid,
                    status:
                        playmate.id === selectedProfile?.id ? "owner" : "pending",
                    name:playmate.name
                },
            ]);
        }
    };

    const handelAutomaticPlaymateSubmit = () => {
        if (selected.length === numberOfPlayers) {
            toast.error("You already have enough players");
            return;
        }
        OnAutoPlayerSelect();
        setIsOpen(false);
    };

    const allPlaymates: PlayerProfile[] = selectedProfile && type == "match"
        ? [selectedProfile, ...(playmates || [])]
        : playmates || [];

    const filteredPlaymates = allPlaymates.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-3 w-full">
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Players
            </span>

            {/* Inline selected chips */}
            <div className="flex flex-wrap gap-2">
                {selected.map((sel) => {

                    return (
                        <motion.div
                            key={sel.profileId}
                            layout
                            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm shadow-sm transition
                ${sel.profileId === selectedProfile?.id
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-slate-300 dark:border-slate-700"
                                }`}
                        >
                            <User className="w-4 h-4" />
                            <span className="truncate max-w-[100px]">
                                {`${sel?.name}`}
                            </span>
                            <X
                                onClick={() =>
                                    onChange(
                                        selected.filter((p) => p.profileId !== sel.profileId)
                                    )
                                }
                                className="w-4 h-4 cursor-pointer hover:text-red-500"
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Dropdown selector */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-gray-900 rounded-lg border shadow-sm hover:shadow-md transition"
                >
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-200 text-sm">
                        <Users className="w-4 h-4" />
                        Add Playmates
                    </span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={16} />
                    </motion.span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-md shadow-lg bg-white dark:bg-gray-800 border text-sm"
                        >
                            {/* Search */}
                            <div className="p-2 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-7 pr-2 py-1.5 text-sm rounded-md bg-slate-50 dark:bg-gray-900 dark:text-white border"
                                    />
                                    <Search
                                        className="absolute left-2 top-2 text-gray-400"
                                        size={15}
                                    />
                                </div>
                            </div>

                            {/* List */}
                            {loading ? (
                                <Loading />
                            ) : filteredPlaymates.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 p-3">
                                    No results
                                </p>
                            ) : (
                                <ul className="divide-y dark:divide-gray-700">
                                    {filteredPlaymates.map((playmate) => {
                                        const selectedNow = isSelected(playmate.id);
                                        return (
                                            <li
                                                key={playmate.id}
                                                onClick={() => handleOnChange(playmate)}
                                                className={`flex items-center justify-between px-3 py-2 cursor-pointer 
                          hover:bg-green-100 dark:hover:bg-green-700 transition
                        ${selectedNow
                                                        ? "bg-green-200 dark:bg-green-600"
                                                        : ""
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-green-600" />
                                                    {playmate.name}
                                                    {playmate.id === selectedProfile?.id && (
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            (You)
                                                        </span>
                                                    )}
                                                </span>
                                                {selectedNow && (
                                                    <Check className="w-4 h-4 text-green-600 dark:text-white" />
                                                )}
                                            </li>
                                        );
                                    })}
                                    {/* Anybody option */}
                                   {type == "match"? <li
                                        onClick={handelAutomaticPlaymateSubmit}
                                        className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-700 transition 
                      ${isAutoPlayerPickerSelected
                                                ? "bg-green-500 text-white"
                                                : ""
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Anybody
                                        </span>
                                        {isAutoPlayerPickerSelected && <Check className="w-4 h-4" />}
                                    </li>:null}
                                </ul>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
