export const Input = ({ label, ...props }) => (
  <div className="flex flex-col flex-1 min-w-[120px]">
    <label className="text-sm font-medium text-gray-300 mb-1 pl-1">{label}</label>
    <input
      {...props}
      className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none transition mb-2"
    />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col flex-1 min-w-[120px]">
    <label className="text-sm font-medium text-gray-300 mb-1 pl-1">{label}</label>
    <select
      {...props}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none transition mb-2"
    >
      {children}
    </select>
  </div>
);

export const ToggleButton = ({ active, children, ...props  }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-full text-sm border font-medium transition-all duration-150 ${
      active
        ? "bg-orange-500 text-white border-orange-400 shadow"
        : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
);