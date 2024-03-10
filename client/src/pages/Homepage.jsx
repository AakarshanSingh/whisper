import MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar';

const Homepage = () => {
  return (
    <div className="flex m-5 h-full w-full rounded-lg overflow-hidden bg-primary bg-clip-padding">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Homepage;
