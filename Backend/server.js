import express from 'express';
import cors from 'cors';
import dbconnect from './db/mongodbconnect.js';
import {saveNewUser} from './controller/userController.js';
import { deleteBudget, fetchBudgetsByUserId, saveNewBudget, updateBudget } from './controller/budgetController.js';
import { deleteExpense, fetchExpenses, fetchRecentExpenses, saveNewExpense, updateExpense } from './controller/expenseController.js';
import { fetchDashboard } from './controller/dashboard.js';
import { generateReport, getBudgetData } from './controller/Report.js';


const app = express();
const port = process.env.PORT || 5000;
// Other routes and middleware

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Sample POST route to handle JSON data
dbconnect();

app.post('/saveUser',saveNewUser);
app.post('/addbudget',saveNewBudget);
app.get('/getbudgets',fetchBudgetsByUserId);
app.post('/addexpense',saveNewExpense);
app.get('/getexpenses',fetchExpenses);
app.get('/getlatestexpenses',fetchRecentExpenses);
app.get('/getDashBoardData',fetchDashboard);
app.get('/getexpensesbymonth',generateReport);
app.get('/getbudgetdata',getBudgetData);
app.put('/updatebudget/:budgetId',updateBudget);
app.delete('/deletebudget/:budgetId',deleteBudget);
app.put('/updateexpense/:expenseId',updateExpense);
app.delete('/deleteexpense/:expenseId',deleteExpense);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
