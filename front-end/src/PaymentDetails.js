import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentDetails.css";
import { user, getUsers } from "./api/users";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  // users from API
  const [users, setUsers] = useState([]);
  const [payment, setPayment] = useState(null);

  const [formData, setFormData] = useState({
    id: -1,
    name: "",
    amount: 0,
    createdAt: "",
    cleared: false,
    categoryId: -1,
    paidBy: -1,
    owedBy: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPayment = async () => {
      const idNum = Number(paymentId);
      if (!Number.isFinite(idNum)) {
        setPayment(null);
        return;
      }

      try {
        const response = await fetch(`/api/rooms/${user.roomId}/payments/${idNum}`);
        if (!response.ok) {
          setPayment(null);
          return;
        }
        const fetched = await response.json();
        setPayment(fetched);

        if (fetched) {
          setFormData({
            id: fetched.id,
            name: fetched.name,
            amount: fetched.amount,
            createdAt: fetched.createdAt,
            cleared: fetched.cleared,
            categoryId: fetched.categoryId,
            paidBy: fetched.paidBy,
            owedBy: [...fetched.owedBy],
          });
        }
      } catch (error) {
        console.error("Error fetching payment:", error);
        setPayment(null);
      }
    };

    fetchPayment();
  }, [paymentId]);

  const getUserNameSync = (id) => {
    const foundUser = users.find(u => u.id === id);
    return foundUser ? foundUser.name : "Unknown";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const num = parseFloat(value);
      setFormData((prev) => ({ ...prev, amount: Number.isNaN(num) ? 0 : num }));
      return;
    }
    if (name === "categoryId" || name === "paidBy") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    if (name === "name" || name === "createdAt") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
  };

  const handleClearedToggle = (e) => {
    setFormData((prev) => ({ ...prev, cleared: e.target.checked }));
  };

  const handleOwedByToggle = (roommateId) => {
    setFormData((prev) => {
      const has = prev.owedBy.includes(roommateId);
      return {
        ...prev,
        owedBy: has ? prev.owedBy.filter((id) => id !== roommateId) : [...prev.owedBy, roommateId],
      };
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/rooms/${user.roomId}/payments/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Payment saved successfully");
        navigate("/payments");
      } else {
        console.error("Error saving payment");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  if (!payment) {
    return <div className="PaymentDetails-loading">Loading...</div>;
  }

  return (
    <div className="PaymentDetails-container">
      <div className="PaymentDetails-header">
        <button className="Back-button" onClick={() => navigate("/payments")}>
          &lt;
        </button>
        <strong>{payment.name}</strong>
      </div>

      <section className="PaymentDetails-section">
        <h2>Edit Payment</h2>

        <div className="form-group">
          <label htmlFor="name">Payment Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="createdAt">Date:</label>
          <input
            type="date"
            id="createdAt"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group checkbox-inline">
          <input
            type="checkbox"
            id="cleared"
            checked={formData.cleared}
            onChange={handleClearedToggle}
          />
          <label htmlFor="cleared">Cleared</label>
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Category:</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
          >
            <option value={-1}>Select category</option>
            <option value={1}>Utilities</option>
            <option value={2}>Groceries</option>
            <option value={3}>Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paidBy">Paid By:</label>
          <select
            id="paidBy"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleInputChange}
          >
            <option value={-1}>Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {getUserNameSync(u.id)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Owed By:</label>
          <div className="checkbox-grid">
            {users.map((u) => (
              <label key={u.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.owedBy.includes(u.id)}
                  onChange={() => handleOwedByToggle(u.id)}
                />
                {getUserNameSync(u.id)}
              </label>
            ))}
          </div>
        </div>
      </section>

      <button className="Save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default PaymentDetails;
