// ═══════════════════════════════════════════════════════════════════════════
//  CSC Tech Board — API Helper
//  Wraps fetch() so every call has consistent error handling + CORS settings
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  const BASE = (window.CSC_CONFIG && window.CSC_CONFIG.WORKER_URL) || '';

  async function call(endpoint, payload) {
    if (!BASE) throw new Error('CSC_CONFIG.WORKER_URL not set');

    const res = await fetch(BASE + endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    });

    if (!res.ok) {
      let errText = 'HTTP ' + res.status;
      try {
        const errBody = await res.json();
        if (errBody.error) errText = errBody.error;
      } catch(_) {}
      throw new Error(errText);
    }

    return await res.json();
  }

  // Public API — all the methods the HTML pages will use
  window.CSC_API = {
    getBoard:        ()         => call('/api/board'),
    getTicket:       (ticketNo) => call('/api/ticket/get',    { ticketNo }),
    assignTicket:    (data)     => call('/api/ticket/assign', data),
    quickStatus:     (data)     => call('/api/ticket/status', data),
    completeTicket:  (data)     => call('/api/ticket/complete', data),

    // Health check — useful for debugging
    health: async function() {
      const res = await fetch(BASE + '/health');
      return await res.json();
    }
  };
})();
