const menuItems = [
  { label: "My Profile", active: true },
  { label: "Manage Subscription" },
  { label: "Redeem Coupons" },
  { label: "My Coupons" },
  { label: "Payment History" },
  { label: "Get Support" },
  { label: "Sign Out" },
  { label: "Delete Account", danger: true },
];

const ProfileSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">MY ACCOUNT</h2>
      <ul className="space-y-4">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={`cursor-pointer px-2 py-1 rounded-md ${
              item.active
                ? "bg-blue-100 text-blue-700 font-semibold"
                : item.danger
                ? "text-red-600 hover:underline"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileSidebar;