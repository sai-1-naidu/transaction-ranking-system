import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const API = "https://transaction-ranking-api-zz3n.onrender.com";

  const [transaction, setTransaction] = useState({
    user_id: "",
    amount: "",
    transaction_type: "",
    idempotency_key: "",
  });

  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState("");
  const [summary, setSummary] = useState(null);

  const [ranking, setRanking] = useState([]);

  const createTransaction = async () => {
    if (transaction.amount <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    if (!transaction.user_id) {
      setMessage("User ID is required");
      return;
    }

    if (!transaction.transaction_type) {
      setMessage("Transaction Type is required");
      return;
    }

    if (!transaction.idempotency_key) {
      setMessage("Idempotency Key is required");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/transaction`,
        transaction
      );

      setMessage(res.data.message);

      loadRanking();

      setTransaction({
        user_id: "",
        amount: "",
        transaction_type: "",
        idempotency_key: "",
      });

    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setMessage(detail[0].msg);
      } else {
        setMessage(detail || "Something went wrong");
      }
    }
  };

  const getSummary = async () => {
    try {
      const res = await axios.get(
        `${API}/summary/${userId}`
      );

      setSummary(res.data);

    } catch (err) {
      setSummary(null);

      alert(
        err.response?.data?.detail ||
        "User not found"
      );
    }
  };

  const loadRanking = async () => {
    try {
      const res = await axios.get(
        `${API}/ranking`
      );

      setRanking(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  return (
    <div className="container">

      <h1 className="title">
        🏆 Transaction Ranking System
      </h1>

      <div className="card">
        <h2>Create Transaction</h2>

        <input
          type="number"
          placeholder="User ID"
          value={transaction.user_id}
          onChange={(e) =>
            setTransaction({
              ...transaction,
              user_id: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={transaction.amount}
          onChange={(e) =>
            setTransaction({
              ...transaction,
              amount: Number(e.target.value),
            })
          }
        />

        <input
          placeholder="Transaction Type"
          value={transaction.transaction_type}
          onChange={(e) =>
            setTransaction({
              ...transaction,
              transaction_type: e.target.value,
            })
          }
        />

        <input
          placeholder="Idempotency Key"
          value={transaction.idempotency_key}
          onChange={(e) =>
            setTransaction({
              ...transaction,
              idempotency_key: e.target.value,
            })
          }
        />

        <button onClick={createTransaction}>
          Create Transaction
        </button>

        {typeof message === "string" && message && (
          <p className="message">
            {message}
          </p>
        )}
      </div>

      <div className="card">
        <h2>User Summary</h2>

        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) =>
            setUserId(e.target.value)
          }
        />

        <button onClick={getSummary}>
          Get Summary
        </button>

        {summary && (
          <div className="summary-box">
            <p>
              <strong>User ID:</strong>{" "}
              {summary.user_id}
            </p>

            <p>
              <strong>Total Transactions:</strong>{" "}
              {summary.total_transactions}
            </p>

            <p>
              <strong>Total Amount:</strong> ₹
              {summary.total_amount}
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🏅 Leaderboard Ranking</h2>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Total Amount</th>
              <th>Transactions</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((user) => (
              <tr
                key={user.user_id}
                className={
                  user.rank === 1
                    ? "rank-1"
                    : user.rank === 2
                    ? "rank-2"
                    : user.rank === 3
                    ? "rank-3"
                    : ""
                }
              >
                <td>
                  {user.rank === 1
                    ? "🥇"
                    : user.rank === 2
                    ? "🥈"
                    : user.rank === 3
                    ? "🥉"
                    : user.rank}
                </td>

                <td>{user.user_id}</td>
                <td>₹{user.total_amount}</td>
                <td>{user.transaction_count}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;