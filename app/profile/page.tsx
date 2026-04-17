"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
 const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);

    const res = await fetch(
      "https://render-jwellery-application-1.onrender.com/api/v1/user/upadate-profile",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      }
    );

    const data = await res.json();

    if (data.success) {
      setFormData((prev) => ({
        ...prev,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
      }));

      toast.success("Profile updated successfully ✅");
    } else {
      toast.error(data.message || "Update failed ❌");
    }
  } catch (err) {
    console.error("Update error:", err);
    toast.error("Something went wrong 🚨");
  }
};
const handlePasswordUpdate = async () => {
  try {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // ✅ Frontend validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match ❌");
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://render-jwellery-application-1.onrender.com/api/v1/user/change-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // ✅ JSON here
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Password updated successfully ✅");

      // 🔥 Clear fields
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      // 🔥 API error message
      toast.error(data.message || "Something went wrong ❌");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error 🚨");
  }
};
const handleDeleteAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://render-jwellery-application-1.onrender.com/api/v1/user/delete-account",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Account deleted successfully 🗑️");

      // 🔥 Logout user
      localStorage.removeItem("token");
      setIsLoggedIn(false);


      // 🔥 Redirect to login / home
      setTimeout(() => {
        router.push("/signin"); // change if needed
      }, 1500);
    } else {
      toast.error(data.message || "Delete failed ❌");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong 🚨");
  }
};
const handlePasswordChange = (e: any) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};
  // 🔥 Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you store it

        const res = await fetch(
          "https://render-jwellery-application-1.onrender.com/api/v1/user/get-profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ token here
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setFormData({
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
            phone: data.data.phone,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 Handle Change
  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10 items-center md:items-start md:justify-center">

      {/* Sidebar */}
      <Card className="w-67 md:w-72 flex flex-col p-0">
        <div className="text-xl font-bold border-b px-4 py-3">
          Account Setting
        </div>

        <div
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 cursor-pointer ${
            activeTab === "profile" ? "bg-red-700 text-white" : "hover:bg-gray-100"
          }`}
        >
          Your Profile
        </div>

        <div
          onClick={() => setActiveTab("reset")}
          className={`px-4 py-3 border-t cursor-pointer ${
            activeTab === "reset" ? "bg-red-700 text-white" : "hover:bg-gray-100"
          }`}
        >
          Reset Password
        </div>

        <div
          onClick={() => setActiveTab("delete")}
          className={`px-4 py-3 border-t cursor-pointer ${
            activeTab === "delete" ? "bg-red-700 text-white" : "hover:bg-gray-100"
          }`}
        >
          Delete
        </div>
      </Card>

      {/* Right Content */}
      <div className="flex-1">
        <Card className="md:p-15 p-10 bg-[#f5f5f5] rounded-2xl shadow-md">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="flex justify-start mb-6">
                <img
                    src="/Images/graduate_4465457.png"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="First Name"
                />

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Last Name"
                />

                <input
                  name="email"
                  value={formData.email}
                  readOnly
                  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
                  placeholder="Email"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className="border p-2 rounded"
                  placeholder="Phone"
                />
              </div>

             <button
  onClick={handleUpdate}
  className="mt-6 bg-red-700 text-white px-6 py-2 rounded-lg"
>
  Update
</button>
            </>
          )}

          {/* RESET PASSWORD */}
          {activeTab === "reset" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Change Password</h2>

              <div className="grid grid-cols-2 gap-6">
               <input
  type="password"
  name="oldPassword"
  value={passwordData.oldPassword}
  onChange={handlePasswordChange}
  className="border p-2 rounded"
  placeholder="Old Password"
/>

<input
  type="password"
  name="newPassword"
  value={passwordData.newPassword}
  onChange={handlePasswordChange}
  className="border p-2 rounded"
  placeholder="New Password"
/>

<input
  type="password"
  name="confirmPassword"
  value={passwordData.confirmPassword}
  onChange={handlePasswordChange}
  className="border p-2 rounded"
  placeholder="Confirm Password"
/>
              </div>
<button
  onClick={handlePasswordUpdate}
  className="mt-6 bg-red-700 text-white px-6 py-2 rounded-lg"
>
  Update Password
</button>
            </>
          )}

          {/* DELETE ACCOUNT */}
          {activeTab === "delete" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Delete Account</h2>

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="mb-4">
                  Are you sure you want to delete your account?
                </p>

                <div className="flex justify-center gap-4">
                  <button  onClick={handleDeleteAccount} className="bg-black text-white px-6 py-2 rounded-lg">
                    Yes
                  </button>
                  <button onClick={() => setActiveTab("profile")} className="bg-red-700 text-white px-6 py-2 rounded-lg">
                    No
                  </button>
                </div>
              </div>
            </>
          )}

        </Card>
      </div>

    </div>
  );
}