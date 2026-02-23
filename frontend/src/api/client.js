const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth:logout'));
  }
  if (!res.ok) {
    const err = new Error(res.statusText);
    err.status = res.status;
    err.body = await res.text();
    try { err.json = JSON.parse(err.body); } catch (_) {}
    throw err;
  }
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const auth = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => api('/auth/me'),
};

export const permitTypes = {
  list: () => api('/permit-types'),
  getById: (id) => api(`/permit-types/${id}`),
  getBySlug: (slug) => api(`/permit-types/by-slug/${slug}`),
};

export const applications = {
  list: () => api('/applications'),
  listStaff: () => api('/applications/staff'),
  getById: (id) => api(`/applications/${id}`),
  create: (body) => api('/applications', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getDocuments: (id) => api(`/applications/${id}/documents`),
  uploadDocument: async (id, file) => {
    const token = getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(API_BASE + `/applications/${id}/documents`, {
      method: 'POST',
      headers,
      body: form,
    });
    if (!res.ok) {
      const err = new Error(res.statusText);
      err.status = res.status;
      err.body = await res.text();
      try { err.json = JSON.parse(err.body); } catch (_) {}
      throw err;
    }
    return res.json();
  },
};

export const documents = {
  list: (params) => {
    const q = new URLSearchParams(params).toString();
    return api('/documents' + (q ? '?' + q : ''));
  },
  categories: () => api('/documents/categories'),
};

export const propertyRecords = {
  search: (q) => api('/property-records/search' + (q ? '?q=' + encodeURIComponent(q) : '')),
};
