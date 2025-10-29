import { useState } from "react";
import { Link } from "react-router-dom";
import "./Payments.css";
import { user, roommates, getRoommateName } from "./users";

const Payments = (props) => {
  // categories table
  const [categories, setCategories] = useState([
    { id: 1, name: "Utility" },
    { id: 2, name: "Groceries" },
    { id: 3, name: "Maintenance" },
  ]);

  // expenses table
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false, categoryId: 1, paidBy: 1, owedBy: [1, 2, 3, 4, 5] },
    { id: 2, name: "Refill water filter", amount: 35.0, createdAt: "2025-10-18", cleared: true, categoryId: 1, paidBy: 2, owedBy: [1, 2, 3] },
    { id: 3, name: "Buy milk", amount: 4.25, createdAt: "2025-10-25", cleared: true, categoryId: 2, paidBy: 3, owedBy: [1, 3, 4] },
    { id: 4, name: "Buy vegetables", amount: 18.6, createdAt: "2025-10-26", cleared: false, categoryId: 2, paidBy: 1, owedBy: [1, 2, 5] },
    { id: 5, name: "Restock snacks", amount: 22.4, createdAt: "2025-10-23", cleared: false, categoryId: 2, paidBy: 4, owedBy: [1, 2, 3, 4] },
    { id: 6, name: "Change air filter", amount: 15.0, createdAt: "2025-10-21", cleared: false, categoryId: 3, paidBy: 5, owedBy: [1, 2, 3, 4, 5] },
    { id: 7, name: "Check smoke detector", amount: 10.0, createdAt: "2025-10-19", cleared: true, categoryId: 3, paidBy: 2, owedBy: [2, 3, 5] },
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
      <div style={{
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
        maxWidth: "1200px"
      }}>
        <h2 style={{
          margin: "0",
          fontSize: "20px",
          color: "#333",
          fontWeight: "600"
        }}>
          Current User: {user.name}
        </h2>
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
              >
                <div>Category: {category.name}</div>
                <div>Amount: {totalFor(categoryExpenses)}$</div>
                <div style={{ fontSize: 13, color: "#7f8c8d", fontWeight: "normal" }}>{isCollapsed ? "Click to expand ▼" : "Click to collapse ▲"}</div>
              </button>

              {!isCollapsed &&
                categoryExpenses.map((expense) => (
                  <div key={expense.id} className="PaymentItem">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <strong>
                          {expense.name} - ${expense.amount}
                          <span style={{ marginLeft: "10px" }} className={expense.cleared ? "Cleared" : "NotCleared"}>
                            {expense.cleared ? "Cleared" : "Not cleared"}
                          </span>
                        </strong>
                        <span style={{ marginLeft: "15px", fontSize: "14px" }}>
                          Paid by: <span style={{ color: expense.paidBy === user.id ? "#1a5490" : "inherit" }}>{getRoommateName(expense.paidBy)}</span> •
                          Owed by: {expense.owedBy.map((id, index) => (
                            <span key={id}>
                              <span style={{ color: id === user.id ? "#1a5490" : "inherit" }}>{getRoommateName(id)}</span>
                              {index < expense.owedBy.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </span>
                      </div>
                      <Link to={`/payments/${expense.id}`}>
                        <button className="EditButton">Edit</button>
                      </Link>
                    </div>
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
