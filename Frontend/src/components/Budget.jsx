import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi"; // Added icons for edit and delete
import axios from "axios";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBudgetTitle, setNewBudgetTitle] = useState("");
  const [newBudgetTotalAmount, setNewBudgetTotalAmount] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);  // Store current expense being edited

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadBudgets(firebaseUser.uid);
      } else {
        setUser(null);
        console.error("No user is logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  const loadBudgets = async (uid) => {
    try {
      const response = await axios.get("http/getbudgets", {
        params: { uid },
      });
      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    }
  };

  const loadExpenses = async (budgetId) => {
    try {
      const response = await axios.get("http://localhost:5000/getexpenses", {
        params: { budgetId },
      });
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleCreateBudget = async (event) => {
    event.preventDefault();
    try {
      if (!user || !user.uid) {
        console.error("User is not logged in or UID is undefined");
        return;
      }

      const newBudget = {
        uid: user.uid,
        title: newBudgetTitle,
        totalAmount: parseFloat(newBudgetTotalAmount),
        remaining: parseFloat(newBudgetTotalAmount),
        expenses: [],
        createdAt: new Date().toISOString(),
      };
      toast.success("Budget Added Successfully !", { autoClose: 1000 });

      await axios.post("http://localhost:5000/addbudget", newBudget);
      loadBudgets(user.uid);
      setNewBudgetTitle("");
      setNewBudgetTotalAmount("");
      setShowForm(false);
    } catch (error) {
      toast.error("Error adding budget !", { autoClose: 1000 });
      console.error("Error adding budget:", error);
    }
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    try {
      const newExpense = {
        budgetId: selectedBudget._id,
        amount: parseFloat(expenseAmount),
        description: expenseDescription,
        date: new Date().toISOString(),
        userId: user.uid,
      };
      await axios.post("http://localhost:5000/addexpense", newExpense);
      toast.success("Expense Added Successfully !", { autoClose: 1000 });
      loadBudgets(user.uid);
      loadExpenses(selectedBudget._id); 
      setExpenseAmount("");
      setExpenseDescription("");
    }catch (error) {
      // Check if the error response contains a specific message
      if (error.response) {
        // Error response from the server
        const errorMessage = error.response.data.message || 'Error updating Expense!';
        toast.error(errorMessage, { autoClose: 2000 });
        console.error("Server Error:", errorMessage);
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from the server.", { autoClose: 1000 });
        console.error("No response from server:", error.request);
      } else {
        // Something happened in setting up the request
        toast.error("Error in request setup: " + error.message, { autoClose: 1000 });
        console.error("Request Setup Error:", error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Manage Your Budgets
        </h1>

        <div
          className="border border-gray-300 bg-white shadow-md rounded-lg p-6 mb-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition"
          onClick={() => {
            setShowForm(!showForm);
            setIsEditingBudget(false); // Ensure we're not editing when adding new
          }}
        >
          <div className="flex items-center">
            <FiPlus className="mr-2 text-blue-600" size={24} />
            <span className="font-semibold text-gray-700 text-lg">
              {isEditingBudget ? "Edit Budget" : "Create New Budget"}
            </span>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={isEditingBudget ? handleUpdateBudget : handleCreateBudget}
            className="mb-6 bg-white shadow-md rounded-lg p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Budget Title"
                value={newBudgetTitle}
                onChange={(e) => setNewBudgetTitle(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
              <input
                type="number"
                placeholder="Total Amount"
                value={newBudgetTotalAmount}
                onChange={(e) => setNewBudgetTotalAmount(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition"
            >
              {isEditingBudget ? "Update Budget" : "Add Budget"}
            </button>
          </form>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Budgets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className={`bg-white shadow-md rounded-lg p-6 ${
                selectedBudget && selectedBudget._id === budget._id
                  ? "border-blue-600 border-2"
                  : ""
              } cursor-pointer hover:bg-gray-50 transition`}
              onClick={() => handleSelectBudget(budget)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{budget.title}</h3>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-600 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingBudget(true);
                      setEditBudgetId(budget._id);
                      setNewBudgetTitle(budget.title);
                      setNewBudgetTotalAmount(budget.totalAmount);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    className="text-gray-600 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBudget(budget._id);
                    }}
                  >
                    <FiTrash size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                Remaining: ${budget.remaining} / Total: ${budget.totalAmount}
              </p>
            </div>
          ))}
        </div>

        {selectedBudget && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Expenses for {selectedBudget.title}
            </h2>

            <form
              onSubmit={isEditingExpense ? handleUpdateExpense : handleAddExpense}
              className="mb-6 bg-white shadow-md rounded-lg p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Expense Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
                <input
                  type="text"
                  placeholder="Expense Description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition"
              >
                {isEditingExpense ? "Update Expense" : "Add Expense"}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white shadow-md rounded-lg p-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      ${expense.amount}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => {
                          setIsEditingExpense(true);
                          setEditExpenseId(expense._id);
                          setExpenseAmount(expense.amount);
                          setExpenseDescription(expense.description);
                        }}
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDeleteExpense(expense._id)}
                      >
                        <FiTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{expense.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Budgets;
