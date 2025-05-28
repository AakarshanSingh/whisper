import Conversations from './Conversations';
import Logout from './Logout';
import SearchInput from './SearchInput';

const Sidebar = () => {  return (
    <div className="flex flex-col h-full overflow-auto border-r border-gray-700 p-4 bg-sidebar">
      <SearchInput />
      <div className="divider px-3"></div>
      <div className="flex-1 overflow-y-auto">
        <Conversations />
      </div>
      <div className="mt-auto pt-4">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
