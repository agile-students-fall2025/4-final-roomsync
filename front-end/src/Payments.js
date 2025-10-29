import { useState } from "react";
import { Link } from "react-router-dom";
import "./Payments.css";
import { user, roommates } from "./users";

const Payments = (props) => {
  // categories table
  const [categories, setCategories] = useState([
    { id: 1, name: "Utility" },
    { id: 2, name: "Groceries" },
    { id: 3, name: "Maintenance" },
  ]);

  // expenses table
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false, categoryId: 1 },
    { id: 2, name: "Refill water filter", amount: 35.0, createdAt: "2025-10-18", cleared: true, categoryId: 1 },
    { id: 3, name: "Buy milk", amount: 4.25, createdAt: "2025-10-25", cleared: true, categoryId: 2 },
    { id: 4, name: "Buy vegetables", amount: 18.6, createdAt: "2025-10-26", cleared: false, categoryId: 2 },
    { id: 5, name: "Restock snacks", amount: 22.4, createdAt: "2025-10-23", cleared: false, categoryId: 2 },
    { id: 6, name: "Change air filter", amount: 15.0, createdAt: "2025-10-21", cleared: false, categoryId: 3 },
    { id: 7, name: "Check smoke detector", amount: 10.0, createdAt: "2025-10-19", cleared: true, categoryId: 3 },
  ]);

  // list of categoryId that is collapsed
  const [collapsedIds, setCollapsedIds] = useState(new Set(categories.map(category => category.id)));

  const toggleCategory = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getExpensesByCategory = (categoryId) => {
    return expenses.filter(expense => expense.categoryId === categoryId);
  };

  const totalFor = (items) => items.reduce((sum, itm) => sum + (Number(itm.amount) || 0), 0).toFixed(2);

  return (
    <>
      <div style={{ margin: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
        <h3>Current User: {user.name}</h3>
      </div>

      <ul className="Payments-list">
        {categories.map((category) => {
          const isCollapsed = collapsedIds.has(category.id);
          const categoryExpenses = getExpensesByCategory(category.id);
          return (
            <li key={category.id} className="Payment-Category">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={!isCollapsed}
                className="CategoryHeader"
                style={{ all: "unset", cursor: "pointer", display: "block" }}
              >
                <div>Category: {category.name}</div>
                <div>Amount: {totalFor(categoryExpenses)}$</div>
                <div style={{ fontSize: 12, color: "#666" }}>{isCollapsed ? "Click to expand" : "Click to collapse"}</div>
              </button>

              {!isCollapsed &&
                categoryExpenses.map((expense) => (
                  <div key={expense.id} className="PaymentItem">
                    <strong>{expense.name}</strong>
                    <div>Assigned to: {expense.assignedTo ?? "-"}</div>
                    <div>Amount: {expense.amount}$</div>
                    <div className={expense.cleared ? "Cleared" : "NotCleared"}>Status: {expense.cleared ? "Cleared" : "Not cleared"}</div>
                  </div>
                ))}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Payments;
