import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {motion} from"framer-motion";
type DateProps = {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void
}

const CustomDatePicker = ({ selectedDate, onChange }: DateProps) => {
    
    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-md mx-auto"
            >
                <h2 className="text-xl font-semibold text-green-600 mb-4 text-center">
                    Select a Date 📅
                </h2>

               { <DatePicker
                    selected={selectedDate}
                    onChange={onChange}
                    inline
                    minDate={new Date()}
                    calendarClassName="!bg-white dark:!bg-gray-800 !text-black dark:!text-white !rounded-lg"
                    dayClassName={(date) =>
                        "!text-sm hover:bg-green-100 dark:hover:bg-green-900 rounded-md transition-all"
                    }
                />}
            </motion.div>
        </div>
    );
}
export default CustomDatePicker;