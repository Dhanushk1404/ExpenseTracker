import mongoose,{Types} from 'mongoose';
import Budget from '../models/budget.js'; // Import the Budget model
import Expense from '../models/expense.js';
// Save new budget to MongoDB
export const saveNewBudget = async (req, res) => {
  const { uid, title, totalAmount, date } = req.body; // Extract data from request body

  try {
    // Create a new budget document
    const newBudget = new Budget({
      uid,                                  // Firebase user ID from req.body
      budgetId: new mongoose.Types.ObjectId(), // Unique budget ID
      title,                                // Budget title
      totalAmount,                          // Total amount of the budget
      remaining: totalAmount,               // Initialize remaining amount as total
      date                                  // Date of budget
    });


    // Save the budget document to MongoDB
    await newBudget.save();

    res.status(201).json({ message: 'Budget saved successfully', budget: newBudget });
  } catch (error) {
    console.error("Error saving budget:", error); // Log the exact error
    res.status(500).json({ message: 'Error saving budget', error });
  }
};

// Fetch budgets for a specific user
export const fetchBudgetsByUserId = async (req, res) => {
  const { uid } = req.query; // Extract UID from request parameters

  try {
    const budgets = await Budget.find({ uid });// Find budgets based on UID
    res.status(200).json(budgets); // Send the budgets in the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error });
  }
};
