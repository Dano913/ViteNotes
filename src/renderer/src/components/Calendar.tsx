import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, X } from 'lucide-react';
import { format, setHours } from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DEFAULT_COLORS = [
  "#0000FF", // Blue
  "#008000", // Green
  "#FFFF00", // Yellow
  "#4B0082", // Purple
  "#FFA500", // Orange
  "#A52A2A"  // Brown
];

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, startHour: number, startMinute: number, endHour: number, endMinute: number, color: string) => void;
  selectedTime: string;
  initialData?: {
    title?: string;
    startHour?: number;
    startMinute?: number;
    endHour?: number;
    endMinute?: number;
    color?: string;
  };
  isUpdating?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, selectedTime, initialData, isUpdating }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [startHour, setStartHour] = useState(initialData?.startHour || 0);
  const [startMinute, setStartMinute] = useState(initialData?.startMinute || 0);
  const [endHour, setEndHour] = useState(initialData?.endHour || 1);
  const [endMinute, setEndMinute] = useState(initialData?.endMinute || 0);
  const [eventColor, setEventColor] = useState(initialData?.color || '#3b82f6');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setStartHour(initialData.startHour || 0);
      setStartMinute(initialData.startMinute || 0);
      setEndHour(initialData.endHour || 1);
      setEndMinute(initialData.endMinute || 0);
      setEventColor(initialData.color || '#3b82f6');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
      alert('End time must be after start time');
      return;
    }
    onSave(title, startHour, startMinute, endHour, endMinute, eventColor);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-[var(--terciary-bg-color)] text-[var(--text-color)] p-6 w-full max-w-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isUpdating ? 'Edit Event' : 'New Event'}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full">
            <X className="w-5 h-5 text-[var(--text-color)] opacity-50" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Time</label>
          <div className="text-[var(--text-color)]">{selectedTime}</div>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-[var(--text-color)] mb-1">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--secondary-bg-color)] text-[var(--text-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Start Time</label>
            <div className="flex gap-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="px-2 py-1 bg-[var(--secondary-bg-color)] text-[var(--text-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="self-center">:</span>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(Number(e.target.value))}
                className="px-2 py-1 bg-[var(--secondary-bg-color)] text-[var(--text-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">End Time</label>
            <div className="flex gap-2">
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="px-2 py-1 bg-[var(--secondary-bg-color)] text-[var(--text-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="self-center">:</span>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(Number(e.target.value))}
                className="px-2 py-1 bg-[var(--secondary-bg-color)] text-[var(--text-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Event Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
              className="w-6 h-7 rounded cursor-pointer bg-[var(--terciary-bg-color)]"
            />
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEventColor(color)}
                  style={{ backgroundColor: color }}
                  className="w-6 h-6 rounded-full "
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--secondary-bg-color)] rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--secondary-bg-color)] rounded-md"
          >
            {isUpdating ? 'Update' : 'Create'} Event
          </button>
        </div>
      </form>
    </div>
  );
}

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getEventsForDay = (day: string) => {
    return events.filter(event => event.start.toDateString() === new Date(day).toDateString());
  };

  const handleTimeSlotClick = (day: string, hour: number) => {
    setSelectedSlot({ day, hour });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleCreateEvent = (
    title: string,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
    color: string
  ) => {
    if (!selectedSlot && !selectedEvent) return;

    const baseDate = selectedSlot ? new Date(selectedSlot.day) : selectedEvent!.start;
    const start = new Date(baseDate);
    start.setHours(startHour, startMinute, 0);

    const end = new Date(baseDate);
    end.setHours(endHour, endMinute, 0);

    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(event =>
        event.id === selectedEvent.id
          ? { ...event, title, start, end, color }
          : event
      ));
    } else {
      // Create new event
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        start,
        end,
        color
      };
      setEvents(prev => [...prev, newEvent]);
    }

    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const calculateEventPosition = (event: Event) => {
    const hour = event.start.getHours();
    const minutes = event.start.getMinutes();
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);

    return {
      top: (hour * 80) + (minutes / 60) * 80,
      height: duration * 80
    };
  };

  return (
    <div className="w-full h-[800px]">
      <div className="h-[900px]">
        <div className="h-[700px] rounded-md">
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day} className="relative">
                <div className="p-3 justify-center text-lg flex gap-4">
                  <div className="">{day}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto h-[800px] custom-scrollbar">
            <div className="grid grid-cols-7 relative">
              {weekDays.map((day) => (
                <div key={day} className="border-r border-[var(--bg-color)] last:border-r-0 relative">
                  {HOURS.map((hour) => (
                    <div
                      key={`${day}-${hour}`}
                      className="group h-20 border-b border-[var(--bg-color)] relative hover:bg-[var(--secondary-bg-color)] transition-colors duration-200"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    >
                      <div className="absolute top-2 left-2 text-xs font-medium text-gray-400">
                        {format(setHours(new Date(), hour), 'ha')}
                      </div>

                      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  ))}

                  {getEventsForDay(day).map(event => {
                    const { top, height } = calculateEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        style={{
                          position: 'absolute',
                          top: `${top}px`,
                          left: '4px',
                          right: '4px',
                          height: `${height}px`,
                          backgroundColor: event.color,
                        }}
                        className="rounded-lg shadow-sm p-2 text-sm text-white relative group transition-transform hover:scale-[1.02] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                      >
                        <div className="font-medium line-clamp-2">{event.title}</div>
                        <div className="text-xs opacity-90 mt-0.5">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                            className="p-1.5 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
          setSelectedEvent(null);
        }}
        onSave={handleCreateEvent}
        selectedTime={selectedSlot
          ? format(setHours(new Date(selectedSlot.day), selectedSlot.hour), 'EEEE, MMMM d, yyyy h:mm a')
          : selectedEvent
          ? format(selectedEvent.start, 'EEEE, MMMM d, yyyy h:mm a')
          : ''
        }
        initialData={selectedEvent ? {
          title: selectedEvent.title,
          startHour: selectedEvent.start.getHours(),
          startMinute: selectedEvent.start.getMinutes(),
          endHour: selectedEvent.end.getHours(),
          endMinute: selectedEvent.end.getMinutes(),
          color: selectedEvent.color
        } : selectedSlot ? {
          startHour: selectedSlot.hour,
          startMinute: 0,
          endHour: selectedSlot.hour + 1,
          endMinute: 0,
        } : undefined}
        isUpdating={!!selectedEvent}
      />
    </div>
  );
}
