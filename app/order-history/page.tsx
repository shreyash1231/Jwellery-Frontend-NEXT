"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { useEffect } from "react";
import { toast } from "sonner";


const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function OrderHistory() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data, isLoading, isError ,error} = useOrders(token || "");
  
 useEffect(() => {
  if (isError) {
    toast.error((error as any)?.message || "Failed to fetch orders");
  }
}, [isError, error]);

  if (isLoading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  const orders = data?.data || [];

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Order History</h2>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => {
                const item = order.items?.[0];
                const product = item?.productId;

                const image = product?.imageUrl?.[0];
                const description =
                  product?.description || "Product not available";

                return (
                  <TableRow key={order._id}>
                    {/* Image */}
                    <TableCell>
                      {image ? (
                        <img
                          src={`${IMAGE_BASE_URL}/${image}`}
                          alt="product"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs rounded-md">
                          No Image
                        </div>
                      )}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="max-w-xs truncate">
                      {description}
                    </TableCell>

                    {/* Order ID */}
                    <TableCell className="text-sm">
                      {order._id}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="font-medium">
                      ₹{order.amount}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "CONFIRMED"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
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