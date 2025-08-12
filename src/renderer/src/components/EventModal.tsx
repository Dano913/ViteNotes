import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Event } from '../types/time';

interface EventModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  onDelete?: (id: string) => void;
  eventToEdit?: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({
  selectedDate,
  onClose,
  onSave,
  onDelete,
  eventToEdit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setColor(eventToEdit.color);
      setTime(eventToEdit.time);
    }
  }, [eventToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      date: selectedDate,
      color,
      time,
    });
    onClose();
  };

  const handleDelete = () => {
    if (eventToEdit && onDelete) {
      onDelete(eventToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--terciary-bg-color)] text-[var(--text-color)] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {eventToEdit ? 'Edit Event' : 'Add Event'}
          </h2>
          <button onClick={onClose} className="text-[var(--text-color)] opacity-50">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Date
              </label>
              <input
                type="text"
                value={selectedDate.toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)] rounded-md bg-[var(--secondary-bg-color)] text-[var(--text-color)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-1 ">
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="custom-scrollbar w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)] bg-[var(--secondary-bg-color)] text-[var(--text-color)]"
              >
                {Array.from({ length: 24 }, (_, h) =>
                  ["00", "15", "30", "45"].map((m) => (
                    <option key={`${h}:${m}`} value={`${String(h).padStart(2, "0")}:${m}`}>
                      {String(h).padStart(2, "0")}:{m}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)] bg-[var(--secondary-bg-color)] text-[var(--text-color)]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)] bg-[var(--secondary-bg-color)] text-[var(--text-color)]"
              rows={3}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className=" h-7 w-6 rounded-md cursor-pointer bg-[var(--terciary-bg-color)] text-[var(--text-color)]"
              />
            </div>
            <div className="flex justify-end gap-8">
            {eventToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
            >
              {eventToEdit ? 'Update Event' : 'Save Event'}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
