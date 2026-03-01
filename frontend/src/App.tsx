import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SidePanel from './components/SidePannel';
import Navigation from './pages/Navigation';
import HelpDesk from './pages/HelpDesk';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import Schedule from './pages/Schedule';
import Faculty from './pages/Faculty';
import Blocks from './pages/Blocks';
import Campus360 from './pages/Campus360';
import useInactivityTimer from './hooks/TrackInactivity';
import FacultyDetail from './pages/FacultyDetail';
import BlockDetail from './pages/BlockDetail';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

const App = () => {
  useInactivityTimer();
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 mt-32 mb-16 relative">
        <div className="fixed top-36 left-4 bottom-20 z-40 w-[400px]">
          <SidePanel />
        </div>

        <div className="fixed top-36 left-[430px] right-0 bottom-20 pr-6 z-30">
          <div className="h-full w-full">
            <Routes>
              <Route path="/" element={<Campus360 />} />
              <Route path="/navigate" element={<Navigation />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcement/:id" element={<AnnouncementDetail />} />
              <Route path="/help" element={<HelpDesk />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/blocks" element={<Blocks />} />
              <Route path="/faculty/:id" element={<FacultyDetail />} />
              <Route path="/block/:id" element={<BlockDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
