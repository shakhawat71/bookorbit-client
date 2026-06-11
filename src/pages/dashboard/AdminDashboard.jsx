/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Link } from "react-router-dom";
import { DashboardStatsSkeleton, ChartSkeleton, TableSkeleton } from "../../components/ui/Skeleton";

// Chart colors
const COLORS = ["#8B5E3C", "#A47148", "#C49A6C", "#E0B88A", "#F5D5B3"];

// ---------- Toast ----------
const showToast = {
  success: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-emerald-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 grid place-items-center">
              <svg className="text-emerald-600" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-emerald-700">{title}</p>
              {desc && <p className="text-sm text-gray-600 mt-0.5">{desc}</p>}
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center">✕</button>
          </div>
        </div>
      ),
      { duration: 3000 }
    ),
  error: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-rose-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 grid place-items-center">
              <svg className="text-rose-600" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-rose-700">{title}</p>
              {desc && <p className="text-sm text-gray-600 mt-0.5">{desc}</p>}
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center">✕</button>
          </div>
        </div>
      ),
      { duration: 3000 }
    ),
};

// ---------- Confirm Modal ----------
function ConfirmModal({ open, title, description, confirmText, onConfirm, onClose, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-base-100 rounded-2xl shadow-2xl p-5"
      >
        <h3 className="text-xl font-bold text-[#8B5E3C]">{title}</h3>
        <p className="text-sm text-base-content/70 mt-2">{description}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn flex-1 btn-outline" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} className="btn flex-1 bg-red-600 text-white hover:bg-red-700 border-0" disabled={loading}>
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---------- Overview Card Component ----------
function OverviewCard({ title, value, icon, trend, trendValue, color }) {
  const isRevenue = title === "Total Revenue";
  const displayValue = isRevenue ? value : value?.toLocaleString();
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-[#8B5E3C]">{displayValue || 0}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trendValue}%
              </span>
              <span className="text-xs text-base-content/50">vs last month</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-[${color}]/10 text-[${color}] grid place-items-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    publishedBooks: 0,
    unpublishedBooks: 0,
    completedOrders: 0,
  });
  
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axiosSecure.get("/admin/dashboard/stats");
      setStats(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showToast.error("Failed to load stats", "Please refresh the page.");
      return null;
    }
  };

  const fetchMonthlyOrders = async () => {
    try {
      const res = await axiosSecure.get("/admin/dashboard/monthly-orders");
      setMonthlyOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch monthly orders:", err);
      setMonthlyOrders([
        { month: "Jan", orders: 0 }, { month: "Feb", orders: 0 }, { month: "Mar", orders: 0 },
        { month: "Apr", orders: 0 }, { month: "May", orders: 0 }, { month: "Jun", orders: 0 },
        { month: "Jul", orders: 0 }, { month: "Aug", orders: 0 }, { month: "Sep", orders: 0 },
        { month: "Oct", orders: 0 }, { month: "Nov", orders: 0 }, { month: "Dec", orders: 0 }
      ]);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await axiosSecure.get("/admin/dashboard/category-distribution");
      setCategoryData(res.data);
    } catch (err) {
      console.error("Failed to fetch category data:", err);
      setCategoryData([{ name: "Published", count: 0 }, { name: "Unpublished", count: 0 }]);
    }
  };

  const fetchRevenueTrend = async () => {
    try {
      const res = await axiosSecure.get("/admin/dashboard/revenue-trend");
      setRevenueTrend(res.data);
    } catch (err) {
      console.error("Failed to fetch revenue trend:", err);
      setRevenueTrend([
        { month: "Jan", revenue: 0 }, { month: "Feb", revenue: 0 }, { month: "Mar", revenue: 0 },
        { month: "Apr", revenue: 0 }, { month: "May", revenue: 0 }, { month: "Jun", revenue: 0 },
        { month: "Jul", revenue: 0 }, { month: "Aug", revenue: 0 }, { month: "Sep", revenue: 0 },
        { month: "Oct", revenue: 0 }, { month: "Nov", revenue: 0 }, { month: "Dec", revenue: 0 }
      ]);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await axiosSecure.get("/admin/dashboard/recent-orders", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortField,
          sortOrder: sortDirection,
        },
      });
      setRecentOrders(res.data.orders || []);
      setTotalOrdersCount(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch recent orders:", err);
      showToast.error("Failed to load orders", "Please refresh.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const forceRefreshAll = async () => {
    setRefreshing(true);
    showToast.success("Refreshing", "Updating dashboard data...");
    
    await Promise.all([
      fetchStats(),
      fetchMonthlyOrders(),
      fetchCategoryData(),
      fetchRevenueTrend(),
      fetchRecentOrders()
    ]);
    
    setRefreshing(false);
    showToast.success("Refreshed", "All dashboard data has been updated.");
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchMonthlyOrders(),
        fetchCategoryData(),
        fetchRevenueTrend(),
      ]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchRecentOrders();
    }
  }, [currentPage, statusFilter, sortField, sortDirection, searchQuery, loading]);

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    try {
      setDeleting(true);
      await axiosSecure.delete(`/admin/orders/${deletingOrder._id}`);
      showToast.success("Order deleted", "The order has been removed.");
      
      setDeleteModalOpen(false);
      setDeletingOrder(null);
      
      setTimeout(async () => {
        await Promise.all([
          fetchStats(),
          fetchMonthlyOrders(),
          fetchCategoryData(),
          fetchRevenueTrend(),
          fetchRecentOrders()
        ]);
        showToast.success("Stats Updated", "Dashboard statistics have been refreshed.");
      }, 500);
      
    } catch (err) {
      console.error("Delete failed:", err);
      showToast.error("Delete failed", err?.response?.data?.message || "Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalOrdersCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalOrdersCount);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 bg-base-300 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-base-300 rounded w-64 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-base-300 rounded w-28 animate-pulse"></div>
        </div>
        <DashboardStatsSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-base-300 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
        <TableSkeleton rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Order"
        description={`Are you sure you want to delete order #${deletingOrder?._id?.slice(-6)}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        onConfirm={handleDeleteOrder}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeletingOrder(null);
          }
        }}
        loading={deleting}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-[#8B5E3C]">Admin Dashboard</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Overview of your bookstore performance with real revenue data
          </p>
        </div>
        <button
          onClick={forceRefreshAll}
          disabled={refreshing}
          className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
        >
          <RefreshCw size={16} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh All"}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<BookOpen size={22} />}
          trend="up"
          trendValue="12"
          color="#8B5E3C"
        />
        <OverviewCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          trend="up"
          trendValue="8"
          color="#8B5E3C"
        />
        <OverviewCard
          title="Total Revenue"
          value={`৳ ${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign size={22} />}
          trend="up"
          trendValue="15"
          color="#8B5E3C"
        />
        <OverviewCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag size={22} />}
          trend={stats.pendingOrders > 5 ? "up" : "down"}
          trendValue={stats.pendingOrders}
          color="#8B5E3C"
        />
        <OverviewCard
          title="Completed Orders"
          value={stats.completedOrders || 0}
          icon={<CheckCircle2 size={22} />}
          trend="up"
          trendValue="5"
          color="#8B5E3C"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-2xl p-4 border border-base-200">
          <p className="text-sm text-base-content/60">Published Books</p>
          <p className="text-2xl font-bold text-green-600">{stats.publishedBooks || 0}</p>
        </div>
        <div className="bg-base-100 rounded-2xl p-4 border border-base-200">
          <p className="text-sm text-base-content/60">Unpublished Books</p>
          <p className="text-2xl font-bold text-orange-600">{stats.unpublishedBooks || 0}</p>
        </div>
        <div className="bg-base-100 rounded-2xl p-4 border border-base-200">
          <p className="text-sm text-base-content/60">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200"
        >
          <h3 className="font-bold text-lg text-[#8B5E3C] mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8B5E3C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200"
        >
          <h3 className="font-bold text-lg text-[#8B5E3C] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`৳ ${value?.toLocaleString()}`, "Revenue"]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#A47148" strokeWidth={3} dot={{ fill: "#8B5E3C", r: 6 }} />
              <Area type="monotone" dataKey="revenue" fill="#8B5E3C" fillOpacity={0.1} stroke="none" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200 lg:col-span-2"
        >
          <h3 className="font-bold text-lg text-[#8B5E3C] mb-4">Book Status Distribution</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300} className="lg:w-1/2">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="lg:w-1/2 space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-base-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#8B5E3C]">{cat.count} books</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl shadow-md border border-base-200 overflow-hidden"
      >
        <div className="p-5 border-b border-base-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#8B5E3C]">Recent Orders</h3>
              <p className="text-sm text-base-content/60">Manage and track customer orders</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-3 py-2 rounded-xl border bg-base-100 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#8B5E3C] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:opacity-80" onClick={() => handleSort("bookName")}>
                  Book <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:opacity-80" onClick={() => handleSort("price")}>
                  Amount <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:opacity-80" onClick={() => handleSort("status")}>
                  Status <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:opacity-80" onClick={() => handleSort("orderDate")}>
                  Date <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <span className="loading loading-spinner text-[#8B5E3C]"></span>
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-base-content/60">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-base-200 hover:bg-base-100/50"
                  >
                    <td className="px-4 py-3 text-sm font-mono">#{order._id?.slice(-8)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{order.customerName || "—"}</p>
                      <p className="text-xs text-base-content/50">{order.userEmail || order.buyerEmail || ""}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.bookName?.slice(0, 30)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#8B5E3C]">৳ {order.price || order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setDeletingOrder(order);
                            setDeleteModalOpen(true);
                          }}
                          className="btn btn-xs btn-ghost text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-base-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-base-content/60">
              Showing {startIndex} to {endIndex} of {totalOrdersCount} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`btn btn-sm ${currentPage === pageNum ? "bg-[#8B5E3C] text-white" : "btn-outline"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes toastbar { from { transform: translateX(-100%); } to { transform: translateX(0%); } }
        .animate-enter { animation: enter 200ms ease-out; }
        .animate-leave { animation: leave 160ms ease-in forwards; }
        @keyframes enter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes leave { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(6px) scale(.98); } }
      `}</style>
    </div>
  );
}