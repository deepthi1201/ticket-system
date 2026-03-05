function Sidebar({ logout }) {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">Support Desk</h2>

      <ul className="space-y-4">
        <li className="hover:text-blue-400 cursor-pointer">
          Dashboard
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Create Ticket
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          My Tickets
        </li>
      </ul>

      <button
        onClick={logout}
        className="mt-10 bg-red-500 px-4 py-2 rounded w-full"
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;