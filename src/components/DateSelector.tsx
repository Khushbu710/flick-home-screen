
import { Button } from "@/components/ui/button";
import { format, addDays, isSameDay } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  // Generate next 7 days including today
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Date</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <Button
              key={date.toISOString()}
              variant={isSelected ? "default" : "outline"}
              className={`
                min-w-[120px] flex-shrink-0 h-16 flex flex-col items-center justify-center
                ${isSelected ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:border-red-300'}
              `}
              onClick={() => onDateSelect(date)}
            >
              <span className="text-xs font-medium">
                {isToday ? 'Today' : format(date, 'EEE')}
              </span>
              <span className="text-lg font-bold">
                {format(date, 'dd')}
              </span>
              <span className="text-xs">
                {format(date, 'MMM')}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
