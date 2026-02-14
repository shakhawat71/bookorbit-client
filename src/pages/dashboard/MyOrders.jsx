import { useEffect, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosSecure.get("/orders/my")
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-4">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              {order.bookTitle} - {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
