import { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { EventsAgenda } from '../components/EventsAgenda';
import { TaskGroups } from '../components/TaskGroups';
import { AddEventModal } from '../components/AddEventModal';

function Time() {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    { id: 'calendar', label: 'WEEK' },
    { id: 'events', label: 'EVENTS' },
    { id: 'tasks', label: 'TASK' },
  ];

  return (
    <div className="w-full flex  justify-center">
        <div className="rounded-md  h-[93vh] sm:h-[90vh] md:h-[93vh] lg:h-[93vh] xl:h-[94vh] mx-3 mt-10 w-full flex flex-col ">
        {/* Header with tabs and add button */}
        <div className="w-full flex items-center justify-center rounded-md  py-3">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? '' 
                    : 'hover:bg-[var(--terciary-bg-color)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'calendar' && (
          <div className="grid gap-3">
            <Calendar />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="w-full">
            <EventsAgenda />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="w-full">
            <TaskGroups />
          </div>
        )}

        {activeTab === 'all' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1 space-y-3">
              <Calendar />
              <Calendar />
            </div>
            <div className="space-y-3">
              <EventsAgenda />
              <TaskGroups />
            </div>
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
      />
    </div>
  );
}
export default Time;