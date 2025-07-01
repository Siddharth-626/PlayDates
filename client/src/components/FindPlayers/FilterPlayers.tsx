const locations = [
    "Whiteoak's Park",
    "Dellwood Park",
    "West Acres Park",
    "Hunter's Green Park",
];
import { motion, AnimatePresence } from "framer-motion";
const skillLevels = ['2.5', '3.0', '3.5', '4.0', '4.5', '5.0'];

type FilterType = {
    selectedLocation: string
    onLocationChange: (value: string) => void
    selectedSkill: string
    onSkillChange: (value: string) => void
}
export default function Filters({ selectedLocation, onLocationChange, selectedSkill, onSkillChange }: FilterType) {
    return (
        <div className="flex gap-4 flex-wrap">
            <AnimatePresence>
                    <motion.select
                        value={selectedLocation}
                        onChange={e => onLocationChange(e.target.value)}
                        className="px-3 py-2 rounded-lg border hover:border-green-400 bg-slate-100 dark:bg-gray-700 text-black dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <option value="">All Locations</option>
                        {locations.map(loc => <option key={loc}>{loc}</option>)}
                    </motion.select>
               <motion.select
                        value={selectedLocation}
                        onChange={e => onLocationChange(e.target.value)}
                        className="px-3 py-2 rounded-lg border hover:border-green-400 bg-slate-100 dark:bg-gray-700 text-black dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                    <option className="rounded-lg " value="">All Skill Levels</option>
                    {skillLevels.map(skill => <option key={skill}>{skill}</option>)}
                 </motion.select>
            </AnimatePresence>
        </div>
    );
}
