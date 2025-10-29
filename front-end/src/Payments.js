import { useState } from "react";
import { Link } from "react-router-dom";
import "./Payments.css";

const Payments = (props) => {
  // Current user
  const currentUser = { id: 1, name: "Brian" };

  // Roommate list
  const roommates = [
    { id: 1, name: "Brian" },
    { id: 2, name: "Ginny" },
    { id: 3, name: "Jacob" },
    { id: 4, name: "Amish" },
    { id: 5, name: "Eslem" },
  ];

  //Temperary data
  const [payments, setPayments] = useState([
    {
      id: 1,
      name: "Utility",
      items: [
        { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false },
        { id: 2, name: "Refill water filter", amount: 35.0, createdAt: "2025-10-18", cleared: true },
      ],
    },
    {
      id: 2,
      name: "Groceries",
      items: [
        { id: 1, name: "Buy milk", amount: 4.25, createdAt: "2025-10-25", cleared: true },
        { id: 2, name: "Buy vegetables", amount: 18.6, createdAt: "2025-10-26", cleared: false },
        { id: 3, name: "Restock snacks", amount: 22.4, createdAt: "2025-10-23", cleared: false },
      ],
    },
    {
      id: 3,
      name: "Maintenance",
      items: [
        { id: 1, name: "Change air filter", amount: 15.0, createdAt: "2025-10-21", cleared: false },
        { id: 2, name: "Check smoke detector", amount: 10.0, createdAt: "2025-10-19", cleared: true },
      ],
    },
  ]);

  // Track which categories are collapsed using a Set of ids
  const [collapsedIds, setCollapsedIds] = useState(new Set(payments.map(paymentCategory => paymentCategory.id)));

  const toggleCategory = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalFor = (items) => items.reduce((sum, itm) => sum + (Number(itm.amount) || 0), 0).toFixed(2);

  return (
    <>
      <ul className="Payments-list">
        {payments.map((paymentCategory) => {
          const isCollapsed = collapsedIds.has(paymentCategory.id);
          return (
            <li key={paymentCategory.id} className="Payment-Category">
              <button
                type="button"
                onClick={() => toggleCategory(paymentCategory.id)}
                aria-expanded={!isCollapsed}
                className="CategoryHeader"
                style={{ all: "unset", cursor: "pointer", display: "block" }}
              >
                <div>Category: {paymentCategory.name}</div>
                <div>Amount: {totalFor(paymentCategory.items)}$</div>
                <div style={{ fontSize: 12, color: "#666" }}>{isCollapsed ? "Click to expand" : "Click to collapse"}</div>
              </button>

              {!isCollapsed &&
                paymentCategory.items.map((paymentItem) => (
                  <div key={paymentItem.id} className="PaymentItem">
                    <strong>{paymentItem.name}</strong>
                    <div>Assigned to: {paymentItem.assignedTo ?? "-"}</div>
                    <div>Amount: {paymentItem.amount}$</div>
                    <div className={paymentItem.cleared ? "Cleared" : "NotCleared"}>Status: {paymentItem.cleared ? "Cleared" : "Not cleared"}</div>
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
