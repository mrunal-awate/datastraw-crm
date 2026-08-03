import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTickets } from '../api/tickets';

const STATUSES = ['All', 'Open', 'In Progress', 'Closed'];

const STATUS_COLORS = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-200 text-gray-700',
};

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debounce: wait 300ms after typing stops before hitting the API,
    // instead of firing a request on every keystroke.
    const timeout = setTimeout(() => {
      setLoading(true);
      listTickets({
        status: status === 'All' ? undefined : status,
        search: search || undefined,
      })
        .then(setTickets)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [status, search]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Support Tickets</h1>
        <Link to="/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Ticket
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, ID, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.ticket_id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/tickets/${t.ticket_id}`)}
              >
                <td className="p-3 font-mono text-sm">{t.ticket_id}</td>
                <td className="p-3">{t.customer_name}</td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3"><StatusBadge status={t.status} /></td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default TicketList;
