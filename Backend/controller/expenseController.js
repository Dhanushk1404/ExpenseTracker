import Expense from '../models/expense.js'; // Import the Expense model
import Budget from '../models/budget.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId

// Ensure you have the correct import for your Expense model

export const saveNewExpense = async (req, res) => {
    const { budgetId, amount, description, date, userId } = req.body;

    // Validate budgetId length and format
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
        return res.status(400).json({ message: "Invalid budget ID format" });
    }

    const budgetObjectId = new mongoose.Types.ObjectId(budgetId); // Use new ObjectId

    try {
        // Check if the budget exists
        const budget = await Budget.findById(budgetObjectId);
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // Check if there is enough remaining budget
        if (budget.remaining < amount) {
            return res.status(400).json({ message: "Insufficient budget remaining" });
        }

        // Create the expense
        const expense = new Expense({
            budgetId: budgetObjectId,
            amount,
            description,
            date,
            userId // Should be a valid string
        });

        await expense.save();

        // Update the budget
        budget.remaining -= amount; // Deduct the amount from remaining budget
        budget.expenses += amount;   // Update total expenses
        await budget.save();

        res.status(201).json(expense);
    } catch (error) {
        console.error("Error adding expense:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ message: "Error adding expense", error: error.message });
    }
};



export const fetchExpenses = async (req, res) => {
    const { budgetId } = req.query;
    try {
        // Ensure that the budgetId is valid
        if (!mongoose.Types.ObjectId.isValid(budgetId)) {
            return res.status(400).json({ message: "Invalid budget ID format" });
        }
        // Convert budgetId to ObjectId
        const budgetObjectId = new mongoose.Types.ObjectId(budgetId);
        
        // Find all expenses associated with the budgetId
        const expenses = await Expense.find({ budgetId: budgetObjectId });
        if (expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for this budget" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses" });
    }
};

export const fetchRecentExpenses = async (req, res) => {
    const userId = req.query.user; // Get user ID from query param
    try {
        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Aggregate to find expenses and join with Budget to get the budget title
        const expenses = await Expense.aggregate([
            {
                $match: { userId: userId } // Match expenses by userId
            },
            {
                $lookup: {
                    from: 'budgets', // The collection name for budgets
                    localField: 'budgetId', // Field from Expense collection (budgetId)
                    foreignField: '_id', // Field from Budget collection (_id)
                    as: 'budget' // Alias for the joined data
                }
            },
            {
                $unwind: { // Unwind the array to get a single budget
                    path: '$budget',
                    preserveNullAndEmptyArrays: true // Keep expenses without a matching budget
                }
            },
            {
                $project: { // Select only the fields to return
                    _id: 1,
                    amount: 1,
                    description: 1,
                    date: 1,
                    'budget.title': 1 // Include budget title
                }
            },
            {
                $sort: { date: -1 } // Sort by date in descending order
            }
        ]);

        if (expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for this user" });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses" });
    }
};
