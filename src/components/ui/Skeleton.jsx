import { motion } from "framer-motion";

// Card Skeleton
export const CardSkeleton = ({ count = 1, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-base-200 rounded-2xl overflow-hidden shadow-md animate-pulse">
          <div className="h-56 bg-base-300 w-full"></div>
          <div className="p-5 space-y-3">
            <div className="h-5 bg-base-300 rounded w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-2/3"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-base-300 rounded w-1/4"></div>
              <div className="h-8 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hero Slider Skeleton
export const HeroSliderSkeleton = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="loading loading-spinner text-[#8B5E3C] loading-lg"></div>
        <p className="text-base-content/60 animate-pulse">Loading amazing books...</p>
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-300">
            {Array(columns).fill(0).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-base-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, i) => (
            <tr key={i} className="border-b border-base-200">
              {Array(columns).fill(0).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-base-200 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Grid Skeleton for Books
export const BooksGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-base-200 rounded-2xl overflow-hidden shadow-md animate-pulse"
        >
          <div className="h-56 bg-base-300 w-full"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-base-300 rounded w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-base-300 rounded w-1/4"></div>
              <div className="h-8 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Detail Page Skeleton
export const BookDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-pulse">
      <div className="bg-base-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image skeleton */}
          <div className="bg-base-100 p-8 flex items-center justify-center">
            <div className="w-full max-w-xs h-96 bg-base-300 rounded-xl"></div>
          </div>
          
          {/* Info skeleton */}
          <div className="p-6 md:p-10 space-y-4">
            <div className="h-8 bg-base-300 rounded w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-6 bg-base-300 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-base-300 rounded w-full"></div>
              <div className="h-4 bg-base-300 rounded w-full"></div>
              <div className="h-4 bg-base-300 rounded w-2/3"></div>
            </div>
            <div className="h-6 bg-base-300 rounded w-1/4"></div>
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-base-300 rounded-lg w-1/2"></div>
              <div className="h-10 bg-base-300 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-base-300 rounded w-24"></div>
              <div className="h-8 bg-base-300 rounded w-16"></div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-base-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton = () => {
  return (
    <div className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200 animate-pulse">
      <div className="h-6 bg-base-300 rounded w-32 mb-4"></div>
      <div className="h-64 bg-base-200 rounded-xl flex items-center justify-center">
        <div className="loading loading-spinner text-[#8B5E3C]"></div>
      </div>
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
        <div className="h-8 bg-base-300 rounded w-32 mb-6"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-28 h-28 rounded-full bg-base-300"></div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="h-6 bg-base-300 rounded w-48"></div>
            <div className="h-4 bg-base-300 rounded w-64"></div>
            <div className="h-4 bg-base-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Skeleton
export const OrderSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-base-100 rounded-2xl p-4 border border-base-200">
          <div className="flex gap-3">
            <div className="w-16 h-20 rounded-xl bg-base-300"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-base-300 rounded w-16"></div>
                <div className="h-6 bg-base-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Wishlist Skeleton
export const WishlistSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-4 animate-pulse">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-base-100 rounded-2xl p-4 flex gap-4 shadow">
          <div className="w-20 h-28 rounded-xl bg-base-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-base-300 rounded w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-6 bg-base-300 rounded w-1/4"></div>
            <div className="h-8 bg-base-300 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner text-[#8B5E3C] loading-lg"></span>
      <p className="text-base-content/60 animate-pulse">{message}</p>
    </div>
  );
};

// Page Transition Skeleton
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-base-300 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-base-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};