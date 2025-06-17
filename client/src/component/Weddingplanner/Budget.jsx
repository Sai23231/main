import React, { useState, useEffect, useRef } from "react";
import CurrencyFormat from "react-currency-format";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  FiPlus,
  FiMinus,
  FiSave,
  FiDollarSign,
  FiCalendar,
  FiList,
  FiPieChart,
  FiBarChart2,
  FiEdit2,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import {
  FaGlassCheers,
  FaUtensils,
  FaCamera,
  FaMusic,
  FaGift,
  FaCar,
} from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "/logo.png"; // Assuming you've converted d.ico to logo.png
import { selectLoggedInUser } from "../UserLogin/authSlice";
import { useSelector } from "react-redux";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
];

const categoryIcons = {
  Venue: <FaGlassCheers className="text-purple-500" />,
  Catering: <FaUtensils className="text-orange-500" />,
  Photography: <FaCamera className="text-blue-500" />,
  Music: <FaMusic className="text-green-500" />,
  Decor: <GiPartyPopper className="text-pink-500" />,
  Transportation: <FaCar className="text-indigo-500" />,
  Gifts: <FaGift className="text-red-500" />,
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [eventName, setEventName] = useState("");
  const [totalBudget, setTotalBudget] = useState(50000);
  const [categories, setCategories] = useState([
    { name: "Venue", amount: 10000 },
    { name: "Catering", amount: 15000 },
    { name: "Photography", amount: 5000 },
  ]);
  const [activeChart, setActiveChart] = useState("pie");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const chartRef = useRef(null);

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
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/budget/getUserBudgets`, {withCredentials: true}
        );
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const saveBudget = async () => {
    if (!eventName.trim()) {
      alert("Please enter an event name");
      return;
    }

    setIsLoading(true);
    const newBudget = {
      id: selectedBudgetId || Date.now().toString(),
      eventName,
      totalBudget,
      categories,
    };

    try {
      let response;
      if (selectedBudgetId) {
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/budget/${selectedBudgetId}`,
          newBudget
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/budget/createUserBudget`,
          newBudget, {withCredentials:true}
        );
      }

      const updatedBudgets = selectedBudgetId
        ? budgets.map((budget) =>
            budget.id === selectedBudgetId ? response.data : budget
          )
        : [...budgets, response.data];

      setBudgets(updatedBudgets);
      setSelectedBudgetId(response.data.id);
    } catch (error) {
      console.error("Error saving budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBudget = (id) => {
    const selectedBudget = budgets.find((budget) => budget._id === id);
    if (selectedBudget) {
      setSelectedBudgetId(selectedBudget._id);
      setEventName(selectedBudget.eventName);
      setTotalBudget(selectedBudget.totalBudget);
      setCategories(selectedBudget.categories);
    }
  };

  const createNewBudget = () => {
    setSelectedBudgetId(null);
    setEventName("");
    setTotalBudget(50000);
    setCategories([
      { name: "Venue", amount: 10000 },
      { name: "Catering", amount: 15000 },
      { name: "Photography", amount: 5000 },
    ]);
  };

  const handleAmountChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = Number(value);
    setCategories(updatedCategories);
  };

  const handleNameChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = value;
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: "", amount: 0 }]);
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    } else {
      alert("You must have at least one category");
    }
  };

  const deleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/budget/${id}`);
        setBudgets(budgets.filter((budget) => budget._id !== id));
        if (selectedBudgetId === id) {
          createNewBudget();
        }
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  };

  const totalSpent = categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );
  const remainingBudget = totalBudget - totalSpent;
  const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

  const chartData = categories.map((cat) => ({
    name: cat.name.length > 12 ? `${cat.name.substring(0, 10)}...` : cat.name,
    fullName: cat.name,
    value: cat.amount,
    fill: COLORS[categories.indexOf(cat) % COLORS.length],
  }));

  const formatXAxisTick = (tick) => {
    return tick.length > 8 ? `${tick.substring(0, 6)}...` : tick;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold text-gray-800">{data.fullName}</p>
          <p className="text-purple-600">₹{data.value.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">
            {((data.value / totalSpent) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Helper function to format currency for PDF output
  // Changed to use "Rs." as prefix to avoid potential font/encoding issues with "₹"
  const formatCurrencyForPdf = (amount) => {
    // Ensure amount is a number, then format with commas
    const formattedAmount = Number(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `Rs. ${formattedAmount}`; // Changed from ₹ to Rs.
  };

  // Function to generate PDF
  const generatePdf = async () => {
    const doc = new jsPDF("p", "pt", "a4");
    const margin = 40; // Increased margin for better look
    let yOffset = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Header and Logo ---
    doc.setFillColor(236, 72, 153); // Pink color for header background
    doc.rect(0, 0, pageWidth, 80, "F"); // Reverted to larger header
    doc.setFontSize(28); // Larger font for header
    doc.setTextColor(255, 255, 255); // White text color
    doc.text("Event Budget Report", margin, 45);

    // Add logo to top right corner
    const imgWidth = 60; // Larger logo
    const imgHeight = 60;
    doc.addImage(
      logo,
      "PNG",
      pageWidth - margin - imgWidth,
      10,
      imgWidth,
      imgHeight
    );

    yOffset = 100; // Start content below the header, more space

    // --- Event Name ---
    doc.setFontSize(20); // Larger font
    doc.setTextColor("#333333");
    doc.text(`Budget for: ${eventName || "Untitled Event"}`, margin, yOffset);
    yOffset += 30; // Increased spacing

    // --- Budget Summary Section ---
    doc.setFontSize(16); // Larger font for section title
    doc.setTextColor("#555555");
    doc.text("Budget Overview", margin, yOffset);
    yOffset += 15; // Increased spacing

    // Draw a line separator
    doc.setDrawColor("#cccccc");
    doc.setLineWidth(0.5);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 15;

    doc.setFontSize(14); // Larger font for summary details
    doc.setTextColor("#333333");
    const summaryLineHeight = 20; // More relaxed line height

    doc.text(`Total Budget:`, margin, yOffset);
    doc.text(formatCurrencyForPdf(totalBudget), pageWidth - margin, yOffset, {
      align: "right",
    });
    yOffset += summaryLineHeight;

    doc.text(`Total Allocated:`, margin, yOffset);
    doc.text(formatCurrencyForPdf(totalSpent), pageWidth - margin, yOffset, {
      align: "right",
    });
    yOffset += summaryLineHeight;

    doc.text(`Remaining Budget:`, margin, yOffset);
    const remainingColor = remainingBudget >= 0 ? "#10B981" : "#EF4444";
    doc.setTextColor(remainingColor);
    doc.text(
      formatCurrencyForPdf(remainingBudget),
      pageWidth - margin,
      yOffset,
      { align: "right" }
    );
    doc.setTextColor("#333333"); // Reset color
    yOffset += summaryLineHeight + 15; // Increased spacing after summary

    // Budget Utilization Bar
    doc.setFontSize(12); // Larger font
    doc.setTextColor("#666666");
    doc.text(`Budget Utilization (${percentageUsed}%)`, margin, yOffset);
    yOffset += 10;

    const progressBarWidth = pageWidth - 2 * margin;
    const progressBarHeight = 8; // Thicker bar
    doc.setFillColor("#E5E7EB");
    doc.rect(margin, yOffset, progressBarWidth, progressBarHeight, "F");

    const filledWidth =
      (Math.min(percentageUsed, 100) / 100) * progressBarWidth;
    const barColor = percentageUsed > 100 ? "#EF4444" : "#EC4899";
    doc.setFillColor(barColor);
    doc.rect(margin, yOffset, filledWidth, progressBarHeight, "F");
    yOffset += progressBarHeight + 20;

    // --- Chart Section ---
    if (chartRef.current) {
      // Add a new page if the chart doesn't fit on the current page
      if (yOffset + 300 > pageHeight - margin) {
        // 300pt is a reasonable estimate for chart height + buffer
        doc.addPage();
        yOffset = margin;
      }

      doc.setFontSize(16);
      doc.setTextColor("#555555");
      doc.text("Budget Distribution Chart", margin, yOffset);
      yOffset += 15;

      doc.setDrawColor("#cccccc");
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 15;

      const chartCanvas = await html2canvas(chartRef.current, {
        scale: 3, // Increased scale for better resolution
        useCORS: true,
      });
      const chartImgData = chartCanvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(chartImgData);
      const imgWidthPdf = pageWidth - 2 * margin;
      const imgHeightPdf = (imgProps.height * imgWidthPdf) / imgProps.width;

      doc.addImage(
        chartImgData,
        "PNG",
        margin,
        yOffset,
        imgWidthPdf,
        imgHeightPdf
      );
      yOffset += imgHeightPdf + 30;
    }

    // --- Category Breakdown Section ---
    if (categories.length > 0) {
      // Add a new page if categories don't fit
      if (yOffset + 50 > pageHeight - margin) {
        // 50pt for title + initial space
        doc.addPage();
        yOffset = margin;
      }

      doc.setFontSize(16);
      doc.setTextColor("#555555");
      doc.text("Detailed Category Breakdown", margin, yOffset);
      yOffset += 15;

      doc.setDrawColor("#cccccc");
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 15;

      // Table Headers
      doc.setFontSize(12); // Reverted to larger font for table headers
      doc.setFont(undefined, "bold");
      doc.setTextColor("#333333");
      doc.text("Category", margin + 10, yOffset);
      doc.text("Amount", pageWidth - margin - 50, yOffset); // Aligned right
      doc.setFont(undefined, "normal");
      yOffset += 10;

      // Line below headers
      doc.setDrawColor("#dddddd");
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 10;

      doc.setFontSize(12); // Reverted to larger font for table rows
      doc.setTextColor("#555555");
      const rowHeight = 20; // More relaxed row height

      categories.forEach((category) => {
        if (yOffset + rowHeight > pageHeight - margin) {
          // If current category overflows, add a new page
          doc.addPage();
          yOffset = margin; // Reset yOffset for new page
          // Re-add headers for continuity on new page (optional but good practice for long tables)
          doc.setFontSize(12);
          doc.setFont(undefined, "bold");
          doc.setTextColor("#333333");
          doc.text("Category", margin + 10, yOffset);
          doc.text("Amount", pageWidth - margin - 50, yOffset);
          doc.setFont(undefined, "normal");
          yOffset += 10;
          doc.setDrawColor("#dddddd");
          doc.line(margin, yOffset, pageWidth - margin, yOffset);
          yOffset += 10;
        }
        doc.text(category.name, margin + 10, yOffset);
        doc.text(
          formatCurrencyForPdf(category.amount),
          pageWidth - margin - 50,
          yOffset,
          { align: "right" }
        );
        yOffset += rowHeight;
      });

      // Total spent in category breakdown
      if (yOffset + 20 > pageHeight - margin) {
        // Check if total fits on current page
        doc.addPage();
        yOffset = margin;
      }
      doc.setDrawColor("#cccccc");
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 10;
      doc.setFont(undefined, "bold");
      doc.text("Total Categories Sum:", margin + 10, yOffset);
      doc.text(
        formatCurrencyForPdf(totalSpent),
        pageWidth - margin - 50,
        yOffset,
        { align: "right" }
      );
      doc.setFont(undefined, "normal");
      yOffset += 20;
    }

    doc.save(`${eventName || "Event"}_Budget_Report.pdf`);
  };

  // ... (rest of your component code remains the same)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Event Budget Manager</h1>
          <p className="opacity-90">
            Plan and track your event expenses with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Budget Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Name */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-2" />
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Wedding, Birthday, Conference..."
              />
            </div>

            {/* Total Budget */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="inline mr-2" />
                Total Budget
              </label>
              <CurrencyFormat
                thousandSeparator={true}
                prefix={"₹"}
                value={totalBudget}
                onValueChange={(values) =>
                  setTotalBudget(values.floatValue || 0)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Enter total budget"
              />
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  <FiList className="inline mr-2" />
                  Budget Categories
                </h3>
                <button
                  onClick={addCategory}
                  className="flex items-center bg-pink-600 text-white px-2 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <FiPlus size={22} />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-3 p-4 rounded-lg border ${
                      category.amount > remainingBudget && remainingBudget < 0
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) =>
                            handleNameChange(index, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="e.g. Venue, Catering"
                          list="category-suggestions"
                        />
                        {categoryIcons[category.name] && (
                          <div className="absolute right-3 top-2.5">
                            {categoryIcons[category.name]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <CurrencyFormat
                        thousandSeparator={true}
                        prefix={"₹"}
                        value={category.amount}
                        onValueChange={(values) =>
                          handleAmountChange(index, values.floatValue || 0)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      onClick={() => removeCategory(index)}
                      className="self-end md:self-center flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Remove category"
                    >
                      <FiMinus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveBudget}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-md"
            >
              <FiSave size={20} />
              <span>{isLoading ? "Saving..." : "Save Budget"}</span>
            </button>
          </div>

          {/* Right Column - Budget Summary */}
          <div className="space-y-6">
            {/* Budget Overview (This section will be recreated in PDF programmatically) */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                <FiDollarSign className="inline mr-2" />
                Budget Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">
                    ₹{totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Allocated:</span>
                  <span className="font-medium">
                    ₹{totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`font-bold ${
                      remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{remainingBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Budget Utilization ({percentageUsed}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentageUsed > 100 ? "bg-red-500" : "bg-pink-500"
                    }`}
                    style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Chart Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  <FiPieChart className="inline mr-2" />
                  Budget Visualization
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveChart("pie")}
                    className={`p-2 rounded-lg ${
                      activeChart === "pie"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    title="Pie Chart"
                  >
                    <FiPieChart size={20} />
                  </button>
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`p-2 rounded-lg ${
                      activeChart === "bar"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    title="Bar Chart"
                  >
                    <FiBarChart2 size={20} />
                  </button>
                </div>
              </div>

              <div ref={chartRef} className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === "pie" ? (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value, entry, index) => (
                          <span className="text-gray-600">
                            {chartData[index].fullName}
                          </span>
                        )}
                      />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey="name"
                        tickFormatter={formatXAxisTick}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${value / 1000}k`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="top"
                          formatter={(value) =>
                            `₹${(value / 1000).toFixed(1)}k`
                          }
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Saved Budgets */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                <FiList className="inline mr-2" />
                Saved Budgets
              </h3>

              {isLoading && budgets.length === 0 ? (
                <div className="text-center py-4">
                  <p>Loading budgets...</p>
                </div>
              ) : budgets.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {budgets.map((budget) => (
                    <div
                      key={budget._id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        selectedBudgetId === budget._id
                          ? "bg-purple-100 border border-purple-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">
                        {budget.eventName || "Untitled Budget"}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => selectBudget(budget._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          title="Select"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteBudget(budget._id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No saved budgets yet</p>
                </div>
              )}

              <button
                onClick={createNewBudget}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FiPlus size={18} />
                <span>Create New Budget</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={generatePdf}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                disabled={!eventName.trim() || categories.length === 0}
              >
                <FiDownload size={18} />
                <span>Download Budget as PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
