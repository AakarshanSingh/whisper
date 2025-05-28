import MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar';

const Homepage = () => {  return (
    <div className="flex h-screen w-screen rounded-lg overflow-hidden bg-primary">
      <div className="w-1/3 min-w-80">
        <Sidebar />
      </div>
      <div className="flex-1">
        <MessageContainer />
      </div>
    </div>
  );
};

export default Homepage;
