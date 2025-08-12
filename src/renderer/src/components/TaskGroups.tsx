import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';

export const TaskGroups: React.FC = () => {
  const { taskGroups, addTaskGroup, addTaskToGroup, updateTaskGroup, updateTask } = useStore();
  const [newGroup, setNewGroup] = useState({
    name: '',
    weeklyHours: 0,
    color: '#ffffff', // Default color
  });
  const [newTask, setNewTask] = useState<{ name: string; duration: number; day: string }>({ name: '', duration: 0, day: '' });
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string; weeklyHours: number; color: string } | null>(null);
  const [editingTask, setEditingTask] = useState<{ id: string; groupId: string; name: string; duration: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.name && newGroup.weeklyHours > 0) {
      const groupId = Date.now().toString();
      addTaskGroup({
        id: groupId,
        name: newGroup.name,
        weeklyHours: newGroup.weeklyHours,
        tasks: [],
        color: newGroup.color,
        day: ''
      });

      setNewGroup({ name: '', weeklyHours: 0, color: '#ffffff' });
      setIsModalOpen(false);
    }
  };

  const handleAddInitialTask = () => {
    if (newTask.name && newTask.duration > 0 && newTask.day) {
      addTaskToGroup(selectedGroupId!, {
        id: `${selectedGroupId}-task-${Date.now()}-${newTask.name}`,
        name: newTask.name,
        duration: newTask.duration,
        title: '',
        completed: false,
        day: newTask.day
      });
      setNewTask({ name: '', duration: 0, day: '' });
    }
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.name && newTask.duration > 0 && selectedGroupId) {
      addTaskToGroup(selectedGroupId, {
        id: `${selectedGroupId}-task-${Date.now()}`,
        name: newTask.name,
        duration: newTask.duration,
        title: '',
        completed: false,
        day: newTask.day
      });
      setNewTask({ name: '', duration: 0, day: '' });
    }
  };

  const handleEditGroup = (groupId: string) => {
    const group = taskGroups.find((g) => g.id === groupId);
    if (group) {
      setEditingGroup({ id: groupId, name: group.name, weeklyHours: group.weeklyHours, color: group.color });
      setSelectedGroupId(groupId);
      setIsModalOpen(true);
    }
  };

  const handleSaveGroup = () => {
    if (editingGroup) {
      updateTaskGroup(editingGroup.id, { name: editingGroup.name, weeklyHours: editingGroup.weeklyHours, color: editingGroup.color });
      setEditingGroup(null);
      setIsModalOpen(false);
    }
  };

  const handleEditTask = (taskId: string, groupId: string, name: string, duration: number) => {
    setEditingTask({ id: taskId, groupId, name, duration });
  };

  const handleSaveTask = () => {
    if (editingTask) {
      updateTask(editingTask.groupId, editingTask.id, { name: editingTask.name, duration: editingTask.duration });
      setEditingTask(null);
    }
  };

  const selectedGroup = taskGroups.find((group) => group.id === selectedGroupId);

  return (
    <div className="h-[900px] w-full">
      <div className="flex mb-4 items-center w-full justify-center  mb-4 py-1 rounded-md">
        
        <h1 className="text-2xl font-semibold">
          Tareas semanales
        </h1>
      </div>
      <div className="flex gap-4 h-[900px]">
        {/* Calendar Section (80% width) */}
        <div className="w-4/5 rounded-md p-4 ">
            <div className="grid grid-cols-7 gap-4 h-[850px] p-4 rounded-md">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="space-y-3 h-full flex flex-col">
                  <div className="p-4 py-0 rounded-md "><h3 className="font-medium flex justify-center">{day}</h3></div>
                  <div className="p-4 rounded-md flex-1">
                  {taskGroups.map((group) =>
                    group.tasks.map((task) =>
                      task.day === day && (
                        <div
                          key={task.id}
                          className="mb-4 p-2 rounded-md gap-x-2 justify-center flex"
                          style={{ backgroundColor: group.color }}
                        >
                          <p className="text-lg text-[var(--text-color)] flex justify-center">
                            {task.name}
                          </p>
                          <p className="text-lg text-[var(--text-color)] flex justify-center">
                            {task.duration} H
                          </p>
                        </div>
                      )
                    )
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Task Groups Section (20% width) */}
        <div className="w-1/5 p-6 rounded-md">
        <div className="w-full justify-center flex mb-2">
          <button
            onClick={() => {
              setSelectedGroupId(null);
              setEditingGroup(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 font-bold hover:bg-[var(--secondary-bg-color)] text-[var(--text-color)] mb-4"
          >
            Create Group
          </button>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[var(--terciary-bg-color)] p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{selectedGroupId ? 'Edit Task Group' : 'Create Task Group'}</h2>
                <form onSubmit={selectedGroupId ? handleSaveGroup : handleSubmitGroup} className="mb-6 flex flex-col space-y-6">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={editingGroup ? editingGroup.name : newGroup.name}
                    onChange={(e) => editingGroup ? setEditingGroup({ ...editingGroup, name: e.target.value }) : setNewGroup({ ...newGroup, name: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-md bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                  />
                  <div className="flex w-full gap-x-8">
                    <input
                      type="number"
                      placeholder="Weekly hours"
                      value={editingGroup ? editingGroup.weeklyHours : newGroup.weeklyHours || ''}
                      onChange={(e) => editingGroup ? setEditingGroup({ ...editingGroup, weeklyHours: Number(e.target.value) }) : setNewGroup({ ...newGroup, weeklyHours: Number(e.target.value) })}
                      className="w-36 px-3 py-2 rounded-md bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                    />
                    <input
                      type="color"
                      placeholder="Color"
                      value={editingGroup ? editingGroup.color : newGroup.color}
                      onChange={(e) => editingGroup ? setEditingGroup({ ...editingGroup, color: e.target.value }) : setNewGroup({ ...newGroup, color: e.target.value })}
                      className="h-11 px-3 py-2 rounded-md bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
                  >
                    {selectedGroupId ? 'Save Group' : 'Create Group'}
                  </button>
                  {selectedGroupId && selectedGroup && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Tasks</h3>
                      <ul className="mt-2">
                        {selectedGroup.tasks.map((task) => (
                          <li key={task.id} className="text-sm text-[var(--text-color)] flex justify-between items-center mb-2">
                            {editingTask && editingTask.id === task.id ? (
                              <div className="w-full flex gap-x-8 justify-between">
                                <input
                                  type="text"
                                  value={editingTask.name}
                                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                                  className="px-2 py-1 text-[var(--text-color)] rounded-md bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                                />
                                <input
                                  type="number"
                                  value={editingTask.duration}
                                  onChange={(e) => setEditingTask({ ...editingTask, duration: Number(e.target.value) })}
                                  className="w-20 px-2 py-1 text-[var(--text-color)] rounded-md bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                                />
                                <button
                                  type="button"
                                  onClick={handleSaveTask}
                                  className="p-4 py-2 bg-[var(--bg-color)] text-white rounded-md hover:bg-[var(--secondary-bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-bg-color)]"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <>
                                <span>{task.name} ({task.duration} hours) - {task.day}</span>
                                <button
                                  type="button"
                                  onClick={() => handleEditTask(task.id, selectedGroupId, task.name, task.duration)}
                                  className="text-blue-500 hover:underline"
                                >
                                  +
                                </button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-4 w-full flex-col mt-4 space-y-4">
                        <div className="justify-between flex gap-x-8">
                        <input
                          type="text"
                          placeholder="New task"
                          value={newTask.name}
                          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                          className="w-20 flex-1 p-2 rounded-md bg-[var(--secondary-bg-color)]"
                        />
                        <input
                          type="number"
                          placeholder="Hours"
                          value={newTask.duration || ''}
                          onChange={(e) =>
                            setNewTask({ ...newTask, duration: Number(e.target.value) })
                          }
                          className="w-20 p-2 rounded-md bg-[var(--secondary-bg-color)]"
                        />
                        <select
                          value={newTask.day}
                          onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                          className="flex-1 p-2 rounded-md bg-[var(--secondary-bg-color)]"
                        >
                          <option value="" disabled>Select day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        </div>
                        <div className="w-full flex justify-center">
                        <button
                          type="button"
                          onClick={handleAddInitialTask}
                          className="px-4 py-2 w-full bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
                        >
                          Add Task
                        </button>
                        </div>
                      </div>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[var(--bg-color)] text-[var(--text-color)] rounded-md hover:bg-[var(--secondary-bg-color)]"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {taskGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-md p-4"
                style={{ backgroundColor: group.color }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-md w-full flex justify-center">
                    {group.weeklyHours} H
                  </p>
                  <button
                    type="button"
                    onClick={() => handleEditGroup(group.id)}
                    className="text-blue-500 hover:underline"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
