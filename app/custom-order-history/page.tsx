"use client";

import Loader from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomOrders } from "@/hooks/useCustomOrder";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CustomOrderHistory() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data, isLoading, isError, error } = useCustomOrders(token || "");

  useEffect(() => {
    if (isError) {
      toast.error((error as any)?.message || "Failed to fetch orders");
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader/>;
  }

  // 🔥 FIX: correct data path
  const orders = data?.data || [];

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Custom Order History
      </h2>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <TableRow key={order._id}>
                  {/* Order ID */}
                  <TableCell className="text-sm">
                    {order._id}
                  </TableCell>

                  {/* Type */}
                  <TableCell className="font-medium">
                    {order.type}
                  </TableCell>

                  {/* Address */}
                  <TableCell className="max-w-xs truncate">
                    {order.address}
                  </TableCell>

                  {/* Delivery Date */}
                  <TableCell className="text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}