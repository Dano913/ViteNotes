import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isToday } from 'date-fns';
import { Event } from '../types/time';
import { getDaysInMonth } from '../lib/calendar';
import EventModal from '../components/EventModal';
import AgendaView from '../components/AgendaView';
import { initDB, getAllEvents, saveEvent, deleteEvent } from '../lib/db';

export const EventsAgenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Load events from the database when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await initDB();
        const savedEvents = await getAllEvents();
        setEvents(savedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null); // Ensure no event is selected when clicking a day
  };

  const handleSaveEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      let updatedEvent: Event;

      if (selectedEvent) {
        // If editing an existing event
        updatedEvent = {
          ...selectedEvent,
          ...eventData
        };
      } else {
        // If creating a new event
        updatedEvent = {
          ...eventData,
          id: crypto.randomUUID(),
        };
      }

      // Save to the database
      await saveEvent(updatedEvent);

      // Update local state
      if (selectedEvent) {
        setEvents(events.map(event =>
          event.id === selectedEvent.id ? updatedEvent : event
        ));
      } else {
        setEvents([...events, updatedEvent]);
      }

      // Clear selection
      setSelectedDate(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save the event. Please try again.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      // Delete from the database
      await deleteEvent(id);

      // Update local state
      setEvents(events.filter(event => event.id !== id));

      // Close the modal if it's open
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedDate(null);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete the event. Please try again.');
    }
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-color)] h-[800px]">
      <div className="mx-auto h-[800px]">
        <div className="flex items-center w-full justify-center bg-[var(--bg-color)] mb-4 rounded-md">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-[var(--secondary-bg-color)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-[var(--secondary-bg-color)] rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {/* Calendar View */}
          <div className="col-span-4 rounded-md overflow-hidden h-[900px] w-full p-4">
            {/* Calendar Header */}
            <div className="text-[var(--text-color)] text-xl bg-[var(--bg-color)] rounded-md pt-2">
              <div className="grid grid-cols-7 justify-center flex">
                {weekDays.map(day => (
                  <div key={day} className="justify-center flex">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-[var(--text-color)] h-[660px] p-2">
                {days.map((date: Date, index: number) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isCurrentDay = isToday(date);

                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(date)}
                      className={`min-h-[90px] rounded-md p-1 px-2 m-1 bg-[var(--bg-color)] border border-[var(--bg-color)] cursor-pointer transition-colors hover:bg-[var(--secondary-bg-color)]
                        ${!isCurrentMonth ? 'text-[var(--secondary-bg-color)]' : 'text-[var(--text-color)]'}
                        ${isCurrentDay ? 'text-green-500' : ''}`}
                    >
                      <div className="font-medium">
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded-md bg-[var(--secondary-bg-color)]"
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agenda View */}
          <div className="col-span-2 rounded-md shadow-lg overflow-hidden bg-[var(--bg-color)] h-[900px]">
            <AgendaView
              events={events}
              currentDate={currentDate}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>

      {selectedDate && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          eventToEdit={selectedEvent}
        />
      )}
    </div>
  );
};
