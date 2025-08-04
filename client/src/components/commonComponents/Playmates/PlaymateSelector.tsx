import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/authContext";
import { usePlaymates } from "@/context/playmatesContext";
import { useProfile } from "@/context/profileContext";
import { useFetchPlaymates } from "@/hooks/useFetchPlaymates";
import { PlayerProfile } from "@/utils/TYPE";
import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Playmate = {
    profileId: string;
    userUid: string;
};

type PlaymatePickerPropsType = {
    selected: Playmate[];
    onChange: (selected: Playmate[]) => void;
    numberOfPlayers: number;
};

export const PlaymatePicker = ({
    selected,
    onChange,
    numberOfPlayers
}: PlaymatePickerPropsType) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [search, setSearch] = useState("");

    const { playmates, loading } = usePlaymates()

    const isSelected = (playmateId: string) =>
        selected.some((val) => val.profileId === playmateId);

    const handleOnChange = (playmate: PlayerProfile) => {
        const alreadySelected = isSelected(playmate.id);

        if (alreadySelected) {
            onChange(selected.filter((val) => val.profileId !== playmate.id));
        } else {
            if (selected.length == numberOfPlayers) {
                toast.error("you cant select players more than ")
                return;
            }
            onChange([
                ...selected,
                {
                    profileId: playmate.id,
                    userUid: playmate.userUid,
                },
            ]);
        }
    };

    const filteredPlaymates = playmates?.filter((playmate) =>
        playmate.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <span className="text-md font-bold text-gray-700 dark:text-gray-300">
                Select Players
            </span>

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search Playmates by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm dark:bg-gray-900 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>

            {loading ? (
                <Loading />
            ) : filteredPlaymates?.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No playmates found.
                </p>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {filteredPlaymates?.slice(0, 4).map((playmate) => {
                        const selectedNow = isSelected(playmate.id);
                        return (
                            <button
                                key={playmate.id}
                                onClick={() => handleOnChange(playmate)}
                                type="button"
                                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${selectedNow
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-white dark:hover:bg-green-400"
                                    } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                            >
                                {playmate.name} {selectedNow && <span className="ml-1">✕</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
