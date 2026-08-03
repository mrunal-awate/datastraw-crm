import { Routes, Route } from 'react-router-dom';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/new" element={<CreateTicket />} />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
      </Routes>
    </div>
  );
}

export default App;
