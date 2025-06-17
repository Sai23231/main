import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiFlag,
  FiMenu,
} from "react-icons/fi";
import {
  FaGlassCheers,
  FaCamera,
  FaUtensils,
  FaRing,
  FaEnvelope,
  FaMusic,
} from "react-icons/fa";
import { selectLoggedInUser } from "../UserLogin/authSlice";
import { useSelector } from "react-redux";

Modal.setAppElement("#root");

const categoryIcons = {
  Venue: <FaGlassCheers className="text-purple-500" />,
  Catering: <FaUtensils className="text-orange-500" />,
  Photography: <FaCamera className="text-blue-500" />,
  Attire: <FaRing className="text-pink-500" />,
  Invitations: <FaEnvelope className="text-red-500" />,
  Entertainment: <FaMusic className="text-green-500" />,
  Other: <FiFlag className="text-gray-500" />,
};

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const WeddingPlannerChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    category: "",
    dueDate: "",
    priority: "Medium",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const categories = [
    "All",
    "Venue",
    "Catering",
    "Photography",
    "Attire",
    "Invitations",
    "Entertainment",
    "Other",
  ];
  const suggestedTasks = {
    Venue: [
      "Book venue",
      "Visit venue",
      "Confirm decorations",
      "Arrange transportation",
      "Plan seating chart",
    ],
    Catering: [
      "Select menu",
      "Book caterer",
      "Food tasting",
      "Finalize guest count",
      "Arrange cake tasting",
    ],
    Photography: [
      "Hire photographer",
      "Schedule pre-wedding shoot",
      "Create shot list",
      "Book videographer",
    ],
    Attire: [
      "Select wedding dress",
      "Arrange fittings",
      "Choose bridesmaid dresses",
      "Groom's attire",
      "Accessories",
    ],
    Invitations: [
      "Design invites",
      "Send invitations",
      "Create wedding website",
      "Manage RSVPs",
      "Order thank you cards",
    ],
    Entertainment: [
      "Book DJ/band",
      "Prepare dance performance",
      "Select ceremony music",
      "Plan reception playlist",
    ],
    Other: [
      "Create registry",
      "Book honeymoon",
      "Obtain marriage license",
      "Plan rehearsal dinner",
    ],
  };
  const navigate = useNavigate();

  // useEffect(() => {
  //   const userSignedIn = localStorage.getItem("token");
  //   if (!userSignedIn) {
  //     navigate("/userlogin");
  //   }
  // }, [navigate]);

  // const userSignedIn = useSelector(selectLoggedInUser);
  // useEffect(() => {
  //   if (!userSignedIn) {
  //     navigate("/userlogin");
  //   }
  // },[userSignedIn]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/getUserTasks`, {withCredentials:true}
      );
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }
  };

  const addTask = async () => {
    if (newTask.name.trim() && newTask.category && newTask.dueDate) {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/createUserTask`,
          newTask, {withCredentials:true}
        );
        setTasks([...tasks, data]);
        setNewTask({ name: "", category: "", dueDate: "", priority: "Medium" });
        setIsAddingTask(false);
        toast.success("Task added successfully!");
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Error adding task");
      }
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  const toggleTask = async (id) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/${id}/toggle`
      );
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
      toast.info("Task status updated!");
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Error updating task status");
    }
  };

  const removeTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/${id}`
      );
      setTasks(tasks.filter((task) => task._id !== id));
      toast.warn("Task removed.");
    } catch (error) {
      console.error("Error removing task:", error);
      toast.error("Error removing task");
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const saveTaskDetails = async (updatedTask) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/${updatedTask._id}`,
        updatedTask
      );
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? data : task))
      );
      closeTaskModal();
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
    try {
      const orderData = items.map((task, index) => ({
        id: task._id,
        order: index,
      }));
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/checklistTasks/order`,
        { tasks: orderData }
      );
      toast.success("Task order updated!");
    } catch (error) {
      console.error("Error updating task order:", error);
      toast.error("Error updating task order");
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      selectedCategory === "All" ? true : task.category === selectedCategory
    )
    .sort((a, b) =>
      sortBy === "dueDate"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : a.priority.localeCompare(b.priority)
    );

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Event Planning Checklist</h1>
          <p className="opacity-90">
            Stay organized and on track for your big day
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Planning Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="dueDate">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          {filteredTasks.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 mb-6"
                  >
                    {filteredTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all ${
                              task.completed ? "opacity-75" : ""
                            }`}
                          >
                            <div className="flex items-center p-4">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-3 text-gray-400 hover:text-gray-600 cursor-move"
                              >
                                <FiMenu size={20} />
                              </div>

                              <button
                                onClick={() => toggleTask(task._id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                                  task.completed
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {task.completed && <FiCheck size={14} />}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {categoryIcons[task.category]}
                                  <p
                                    className={`font-medium truncate ${
                                      task.completed
                                        ? "line-through text-gray-500"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {task.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <FiCalendar className="mr-1" size={14} />
                                    <span>{formatDate(task.dueDate)}</span>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      priorityColors[task.priority]
                                    }`}
                                  >
                                    {task.priority} priority
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => openTaskModal(task)}
                                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 size={18} />
                                </button>
                                <button
                                  onClick={() => removeTask(task._id)}
                                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FiCheck className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or add a new task
              </p>
            </div>
          )}

          {/* Add Task Section */}
          {isAddingTask ? (
            <div className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Add New Task
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {newTask.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task
                    </label>
                    <select
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a task</option>
                      {suggestedTasks[newTask.category]?.map((task) => (
                        <option key={task} value={task}>
                          {task}
                        </option>
                      ))}
                      <option value="custom">Custom task...</option>
                    </select>
                  </div>
                )}

                {newTask.name === "custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Task Name
                    </label>
                    <input
                      type="text"
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter task name"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsAddingTask(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <FiPlus className="mr-2" />
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all flex items-center justify-center"
            >
              <FiPlus className="mr-2" />
              Add New Task
            </button>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeTaskModal}
        contentLabel="Task Details"
        className="modal-content bg-white rounded-xl shadow-2xl mx-auto my-12 p-6 max-w-md w-full outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        {selectedTask && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  value={selectedTask.name}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedTask.category}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closeTaskModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveTaskDetails(selectedTask)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default WeddingPlannerChecklist;
