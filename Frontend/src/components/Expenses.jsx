import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); 

    // Function to load recent expenses
    const loadRecentExpenses = async (uid) => {
        const userId = uid; // Replace with dynamic user ID if available

        try {
            const response = await axios.get(`https://expensetracker-backend-s78u.onrender.com/getlatestexpenses?user=${userId}`);
            setExpenses(response.data); // Set the expenses from the response
        } catch (err) {
            console.error("Error fetching recent expenses:", err);
            setError("Failed to load expenses."); // Set error message
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // useEffect to load expenses on component mount
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUserId(firebaseUser.uid); // Set user ID from Firebase
          } else {
            console.error("No user is logged in");
          }
        });
    
        return () => unsubscribe();
      }, []);
    
      // Fetch dashboard data when user ID is available
      useEffect(() => {
        if (userId) {
          loadRecentExpenses(userId);
        }
      }, [userId]);

    // Render expenses
    if (loading) {
        return <div className="text-center mt-20 text-blue-600">Loading...</div>; // Show loading state
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>; // Show error message
    }

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Recent Expenses</h1>
                
                {expenses.length === 0 ? (
                    <p className="text-center text-gray-600">No expenses found.</p> // Message if no expenses
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-violet-500 text-white">
                                    <th className="py-3 px-4 text-left">Amount</th>
                                    <th className="py-3 px-4 text-left">Description</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Budget Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="border-t">
                                        <td className="py-2 px-4">{expense.amount}</td>
                                        <td className="py-2 px-4">{expense.description}</td>
                                        <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{expense.budget ? expense.budget.title : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Expenses;
