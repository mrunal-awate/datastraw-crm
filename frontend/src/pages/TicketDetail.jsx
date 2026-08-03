import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/tickets';

const STATUSES = ['Open', 'In Progress', 'Closed'];

function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getTicket(ticketId)
      .then(setTicket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  async function handleStatusChange(status) {
    setSaving(true);
    try {
      await updateTicket(ticketId, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await updateTicket(ticketId, { notes: newNote });
      setNewNote('');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!ticket) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-blue-600 text-sm">&larr; Back to tickets</Link>

      <div className="bg-white rounded shadow-sm p-6 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 font-mono">{ticket.ticket_id}</p>
            <h1 className="text-xl font-semibold text-gray-800">{ticket.subject}</h1>
          </div>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={saving}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Customer:</span> {ticket.customer_name} ({ticket.customer_email})</p>
          <p><span className="font-medium">Created:</span> {new Date(ticket.created_at).toLocaleString()}</p>
        </div>

        <p className="mt-4 text-gray-800">{ticket.description}</p>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Notes</h2>
          {ticket.notes.length === 0 ? (
            <p className="text-sm text-gray-400">No notes yet.</p>
          ) : (
            <ul className="space-y-2">
              {ticket.notes.map((n) => (
                <li key={n.id} className="bg-gray-50 border border-gray-200 rounded p-2 text-sm">
                  <p>{n.note_text}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
