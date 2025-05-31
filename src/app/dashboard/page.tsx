"use client";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Welcome to Car Link Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Your Vehicles</h3>
          <p>Manage your vehicles and listings</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Rental Requests</h3>
          <p>View and manage rental requests</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Your Profile</h3>
          <p>Update your profile information</p>
        </div>
      </div>
    </div>
  );
}
