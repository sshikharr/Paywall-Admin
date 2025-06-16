export default function SidebarItem({ active, icon, text, onClick, expanded }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center py-3 px-4 w-full ${
          active ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {expanded && <span className="ml-3">{text}</span>}
      </button>
    );
  }