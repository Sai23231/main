import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPlus, FaRegStickyNote, FaSearch, FaUser, FaCalendarAlt, FaUsers, FaTasks, FaMoneyBillWave, FaStore } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
// import BudgetTracker from './BudgetTracker'; // Import your BudgetTracker component
// import VendorMarketplace from './VendorMarketplace'; // Import your VendorMarketplace component

// const socket = io(import.meta.env.VITE_BACKEND_URL);
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"], // Force WebSocket for stability
  secure: true, // Ensure secure connection (HTTPS)
  withCredentials: true, // Send cookies if needed
});

const TaskDashboard = () => {    
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [taskMessage, setTaskMessage] = useState({ type: '', text: '' });
  const [memberMessage, setMemberMessage] = useState({ type: '', text: '' });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [eventDetails, setEventDetails] = useState({
    name: 'Family Reunion 2023',
    date: '2023-12-15',
    location: 'Grandma\'s House',
    description: 'Annual family gathering with games, food, and fun!'
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [selectedTaskChat, setSelectedTaskChat] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
    fetchChatMessages();

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    socket.on('taskAdded', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on('memberAdded', (newMember) => {
      setTeamMembers((prevMembers) => [...prevMembers, newMember]);
    });

    socket.on('userOnline', (users) => {
      setOnlineUsers(users);
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    });

    socket.on('newChatMessage', (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('taskUpdated');
      socket.off('taskAdded');
      socket.off('memberAdded');
      socket.off('userOnline');
      socket.off('taskDeleted');
      socket.off('newChatMessage');
    };
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks/getUserTasks`, {
        withCredentials: true // Ensure cookies are sent for authentication
      });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teamMembers/getUserTeamMembers`, {
        withCredentials: true // Ensure cookies are sent for authentication
      });
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat`);
      setChatMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.assignedTo.trim()) {
      setTaskMessage({ type: 'error', text: 'Please fill all fields before adding a task.' });
      return;
    }
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tasks/createUserTask`, newTask, {
        withCredentials: true // Ensure cookies are sent for authentication
      });
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      setShowAddTaskModal(false);
      setTaskMessage({ type: 'success', text: 'Task added successfully!' });
      socket.emit('taskAdded', data);
    } catch (error) {
      console.error('Error adding task:', error);
      setTaskMessage({ type: 'error', text: 'Error adding task. Please try again.' });
    }
  };

  const addMember = async () => {
    if (!newMember.trim()) {
      setMemberMessage({ type: 'error', text: 'Please provide a valid member name.' });
      return;
    }
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/teamMembers/addUserTeamMember`, { name: newMember }, {withCredentials: true});
      setTeamMembers([...teamMembers, data]);
      setNewMember('');
      setShowAddMemberModal(false);
      setMemberMessage({ type: 'success', text: 'Member added successfully!' });
      socket.emit('memberAdded', data);
    } catch (error) {
      console.error('Error adding member:', error);
      setMemberMessage({ type: 'error', text: 'Error adding member. Please try again.' });
    }
  };

  const sendChatMessage = async () => {
    if (!newChatMessage.trim()) return;
    
    const messageData = {
      taskId: selectedTaskChat,
      sender: 'Current User', // Replace with actual user
      message: newChatMessage,
      timestamp: new Date()
    };
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, messageData);
      setChatMessages([...chatMessages, data]);
      setNewChatMessage('');
      socket.emit('newChatMessage', data);
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/tasks/complete/${taskId}`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data : task))
      );
      socket.emit('taskUpdated', data);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  
  const handleEditTask = async () => {
    if (!editingTask.title.trim() || !editingTask.description.trim()) {
      setTaskMessage({ type: 'error', text: 'Title and description are required.' });
      return;
    }
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/update/${editingTask._id}`,
        editingTask
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === editingTask._id ? data : task))
      );
      setShowEditTaskModal(false);
      setTaskMessage({ type: 'success', text: 'Task updated successfully!' });
      socket.emit('taskUpdated', data);
    } catch (error) {
      console.error('Error updating task:', error);
      setTaskMessage({ type: 'error', text: 'Error updating task. Please try again.' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tasks/delete/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      socket.emit('taskDeleted', taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const closeAddTaskModal = () => {
    setShowAddTaskModal(false);
    setTaskMessage({ type: '', text: '' });
  };

  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
    setMemberMessage({ type: '', text: '' });
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const taskChatMessages = selectedTaskChat 
    ? chatMessages.filter(msg => msg.taskId === selectedTaskChat)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">{eventDetails.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{new Date(eventDetails.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers />
            <span>{teamMembers.length} family members participating</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTasks />
            <span>{pendingTasks.length} tasks to complete</span>
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {onlineUsers.map((user, index) => (
          <div key={index} className="flex items-center gap-2 bg-green-100 p-2 rounded-full px-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <FaUser className="text-green-500" />
            <span className="text-sm text-green-700">{user}</span>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'tasks' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('tasks')}
        >
          <FaTasks className="inline mr-2" /> Tasks
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'members' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('members')}
        >
          <FaUsers className="inline mr-2" /> Team
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'budget' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('budget')}
        >
          <FaMoneyBillWave className="inline mr-2" /> Budget
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'vendors' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('vendors')}
        >
          <FaStore className="inline mr-2" /> Vendors
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('details')}
        >
          <FaCalendarAlt className="inline mr-2" /> Event
        </button>
      </div>

      {/* Search and Add Buttons */}
      {activeTab !== 'budget' && activeTab !== 'vendors' && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab === 'tasks' && (
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus /> Add Task
              </button>
            )}
            {activeTab === 'members' && (
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus /> Add Member
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {activeTab === 'tasks' && (
          <>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaTasks /> Event Tasks
            </h3>
            {loading ? (
              <p className="text-center text-gray-500">Loading tasks...</p>
            ) : (
              <>
                {pendingTasks.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">To Do ({pendingTasks.length})</h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {pendingTasks.map((task, index) => (
                        <div key={index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{task.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {task.assignedTo}
                                </span>
                                {task.dueDate && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => handleTaskComplete(task._id)}
                                className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition duration-300"
                                title="Mark Complete"
                              >
                                <FaCheck className="text-green-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowEditTaskModal(true);
                                }}
                                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition duration-300"
                                title="Edit"
                              >
                                <FaEdit className="text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition duration-300"
                                title="Delete"
                              >
                                <FaTrash className="text-red-600" />
                              </button>
                              <button
                                onClick={() => setSelectedTaskChat(task._id)}
                                className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition duration-300"
                                title="Chat"
                              >
                                <FaRegStickyNote className="text-yellow-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">Completed ({completedTasks.length})</h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {completedTasks.map((task, index) => (
                        <div key={index} className="border-l-4 border-green-500 bg-gray-50 p-4 rounded-lg shadow-sm opacity-80">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 line-through">{task.title}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-through">{task.description}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  {task.assignedTo}
                                </span>
                                {task.dueDate && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition duration-300"
                                title="Delete"
                              >
                                <FaTrash className="text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'members' && (
          <>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaUsers /> Team Members
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaUser />
                    </div>
                    <div>
                      <h4 className="font-bold">{member.name}</h4>
                      <p className="text-sm text-gray-600">
                        {onlineUsers.includes(member.name) ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                          </span>
                        ) : (
                          <span className="text-gray-400">Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {teamMembers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No team members yet. Add family members to get started!</p>
              </div>
            )}
          </>
        )}

        {/* {activeTab === 'budget' && (
          <BudgetTracker 
            eventId="current-event" 
            teamMembers={teamMembers} 
            socket={socket} 
          />
        )}

        {activeTab === 'vendors' && (
          <VendorMarketplace 
            eventId="current-event" 
            teamMembers={teamMembers} 
            socket={socket} 
          />
        )} */}

        {activeTab === 'details' && (
          <>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaCalendarAlt /> Event Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={eventDetails.name}
                  onChange={(e) => setEventDetails({...eventDetails, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={eventDetails.date}
                  onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={eventDetails.location}
                  onChange={(e) => setEventDetails({...eventDetails, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  value={eventDetails.description}
                  onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})}
                />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

      {/* Task Chat Modal */}
      {selectedTaskChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Task Discussion</h3>
              <button 
                onClick={() => setSelectedTaskChat(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4">
              {taskChatMessages.length > 0 ? (
                taskChatMessages.map((msg, index) => (
                  <div key={index} className="mb-3">
                    <div className="font-semibold text-sm">{msg.sender}</div>
                    <div className="text-sm bg-gray-100 p-2 rounded-lg inline-block">
                      {msg.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <button
                onClick={sendChatMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Task</h3>
            {taskMessage.text && (
              <div className={`mb-4 p-3 rounded-lg ${taskMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {taskMessage.text}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full p-3 border rounded-lg"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  placeholder="Details about the task..."
                  className="w-full p-3 border rounded-lg"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To*</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Select a family member</option>
                  {teamMembers.map((member, index) => (
                    <option key={index} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeAddTaskModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Family Member</h3>
            {memberMessage.text && (
              <div className={`mb-4 p-3 rounded-lg ${memberMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {memberMessage.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Name*</label>
              <input
                type="text"
                placeholder="Enter family member's name"
                className="w-full p-3 border rounded-lg"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeAddMemberModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To*</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={editingTask.assignedTo}
                  onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                >
                  <option value="">Select a family member</option>
                  {teamMembers.map((member) => (
                    <option key={member._id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;