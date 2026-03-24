import React from "react";
import { getAdminDashboardStats } from "@/lib/admin.queries";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

export const revalidate = 60;

const AdminDashboard = async () => {
  const stats = await getAdminDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-8">
        
        {/* Total Revenue */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
            <svg className="fill-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V5Z" fill="currentColor" />
              <path d="M19 9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9V19C17 19.5523 17.4477 20 18 20C18.5523 20 19 19.5523 19 19V9Z" fill="currentColor" />
              <path d="M7 13C7 12.4477 6.55228 12 6 12C5.44772 12 5 12.4477 5 13V19C5 19.5523 5.44772 20 6 20C6.55228 20 7 19.5523 7 19V13Z" fill="currentColor" />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black">
                ${formatPrice(stats.totalRevenue)}
              </h4>
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
            <svg className="fill-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5ZM5 7H19V19H5V7Z" fill="currentColor" />
              <path d="M5 9H19V11H5V9Z" fill="currentColor" />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black">
                {stats.totalOrders}
              </h4>
              <span className="text-sm font-medium">Total Orders</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
            <svg className="fill-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black">
                {stats.totalProducts}
              </h4>
              <span className="text-sm font-medium">Total Products</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
            <svg className="fill-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black">
                {stats.totalCustomers}
              </h4>
              <span className="text-sm font-medium">Total Customers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black">
          Recent Orders
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Order ID
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Customer
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Date
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Total
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
          </div>

          {stats.recentOrders.map((order: any, key: number) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                key === stats.recentOrders.length - 1
                  ? ""
                  : "border-b border-stroke"
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black">
                  {order.orderNumber}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black">{order.customerName}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">${formatPrice(order.total)}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-success text-success' :
                  order.status === 'cancelled' ? 'bg-danger text-danger' :
                  'bg-warning text-warning'
                }`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
