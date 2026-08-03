const supabase = require('../config/supabaseClient');

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'];

// POST /api/tickets
async function createTicket(req, res) {
  const { customer_name, customer_email, subject, description } = req.body;

  if (!customer_name || !customer_email || !subject || !description) {
    return res.status(400).json({
      error: 'customer_name, customer_email, subject, and description are all required.',
    });
  }

  const { data, error } = await supabase
    .from('tickets')
    .insert({ customer_name, customer_email, subject, description })
    .select('ticket_id, created_at')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create ticket.' });
  }

  res.status(201).json(data);
}

// GET /api/tickets?status=Open&search=jane
async function listTickets(req, res) {
  const { status, search } = req.query;

  let query = supabase
    .from('tickets')
    .select('ticket_id, customer_name, subject, status, created_at')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    const term = `%${search}%`;
    // Searches across name, email, subject, description, and ticket_id in one query
    query = query.or(
      `customer_name.ilike.${term},customer_email.ilike.${term},subject.ilike.${term},description.ilike.${term},ticket_id.ilike.${term}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch tickets.' });
  }

  res.json(data);
}

// GET /api/tickets/:ticketId
async function getTicket(req, res) {
  const { ticketId } = req.params;

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (ticketError || !ticket) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('id, note_text, created_at')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (notesError) {
    console.error(notesError);
    return res.status(500).json({ error: 'Failed to fetch notes.' });
  }

  res.json({ ...ticket, notes });
}

// PUT /api/tickets/:ticketId
async function updateTicket(req, res) {
  const { ticketId } = req.params;
  const { status, notes } = req.body;

  if (!status && !notes) {
    return res.status(400).json({ error: 'Provide at least a status or a note to update.' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  // Confirm the ticket exists before touching anything
  const { data: existing, error: findError } = await supabase
    .from('tickets')
    .select('ticket_id')
    .eq('ticket_id', ticketId)
    .single();

  if (findError || !existing) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  if (status) {
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status })
      .eq('ticket_id', ticketId);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ error: 'Failed to update ticket status.' });
    }
  }

  if (notes) {
    const { error: noteError } = await supabase
      .from('notes')
      .insert({ ticket_id: ticketId, note_text: notes });

    if (noteError) {
      console.error(noteError);
      return res.status(500).json({ error: 'Failed to add note.' });
    }
  }

  const { data: updated } = await supabase
    .from('tickets')
    .select('updated_at')
    .eq('ticket_id', ticketId)
    .single();

  res.json({ success: true, updated_at: updated.updated_at });
}

module.exports = { createTicket, listTickets, getTicket, updateTicket };
