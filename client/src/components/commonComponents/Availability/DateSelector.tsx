import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

type DateProps = {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
};

const CustomDatePicker = ({ selectedDate, onChange }: DateProps) => {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--content-muted)] mb-2">
                <Calendar className="w-4 h-4 text-[var(--accent-green)]" />
                Select Date
            </div>
            <div className="date-picker-wrapper rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
                <DatePicker
                    selected={selectedDate}
                    onChange={onChange}
                    inline
                    minDate={new Date()}
                    calendarClassName="custom-calendar"
                />
            </div>
            {selectedDate && (
                <div className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20">
                    <Calendar className="w-4 h-4 text-[var(--accent-green)]" />
                    <span className="text-[14px] font-bold text-[var(--accent-green)]">
                        {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </span>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
