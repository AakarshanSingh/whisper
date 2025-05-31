import MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar';

const Homepage = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
      <div className="w-80 min-w-80 max-w-80 flex-shrink-0 overflow-hidden">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <MessageContainer />
      </div>
    </div>
  );
};

export default Homepage;
