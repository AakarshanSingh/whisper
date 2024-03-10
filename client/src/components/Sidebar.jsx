import Conversations from './Conversations';
import Logout from './Logout';
import SearchInput from './SearchInput';

const Sidebar = () => {
  return (
    <div className="flex overflow-auto border border-secondary p-4 items-stretch flex-col bg-sidebar">
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <div className="self-end">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
