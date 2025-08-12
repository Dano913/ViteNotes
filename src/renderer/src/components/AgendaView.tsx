import React, { useState } from 'react';
import { Event } from '../types/time';
import EventModal from './EventModal';

interface AgendaViewProps {
  events: Event[];
  currentDate: Date;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ events, currentDate, onEditEvent, onDeleteEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEvent = (event: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      onEditEvent({ ...selectedEvent, ...event });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    onDeleteEvent(id);
    handleCloseModal();
  };

  // Filter events for the current month and sort by date and time
  const monthEvents = events
    .filter(event => event.date.getMonth() === currentDate.getMonth())
    .sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare === 0) {
        return a.time.localeCompare(b.time);
      }
      return dateCompare;
    });

  return (
    <div className="rounded-md overflow-hidden bg-[var(--bg-color)] h-[900px]">
      
      <div className="m-2 rounded-md overflow-auto custom-scrollbar h-[680px] space-y-4">
        {monthEvents.length === 0 ? (
          <div className="opacity-50"><p className="text-[var(--text-color)] text-center mt-6">No events scheduled for this month</p></div>
        ) : (
          monthEvents.map(event => (
            <div
              key={event.id}
              className="m-2 ml-0 pr-2 hover:bg-[var(--terciary-bg-color)] hover:opacity-60 rounded-md cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex gap-2 items-center grid grid-cols-9 font-serif">
                <div className="text-[var(--text-color)] col-span-4 flex grid grid-cols-5">
                  <div className="text-4xl col-span-2 justify-center flex">
                    {event.date.toLocaleDateString('en-UK', { day: 'numeric' })}
                  </div>
                  <div className="text-md flex flex-col col-span-2 ">
                    <div>{event.date.toLocaleDateString('en-UK', { weekday: 'long' })}</div>
                    <div>{event.time}</div>
                  </div>
                </div>
                <div className=" flex-1 bg-[var(--secondary-bg-color)] text-[var(--text-color)] h-[70px] rounded-md p-2 px-4 col-span-5">
                  <h3 className="text-xl text-[var(--text-color)]">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-1 text-sm">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isEditModalOpen && selectedEvent && (
        <EventModal
          selectedDate={selectedEvent.date}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDelete}
          eventToEdit={selectedEvent}
        />
      )}
    </div>
  );
};

export default AgendaView;
