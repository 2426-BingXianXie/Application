import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { permitTypes as permitTypesApi, applications as applicationsApi } from '../api/client';
import './ApplicationFormPage.css';

export default function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [permitType, setPermitType] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    permitTypesApi.getById(id)
      .then((pt) => {
        setPermitType(pt);
        const fields = pt.formSchema?.fields || [];
        const initial = {};
        fields.forEach((f) => {
          initial[f.name] = '';
        });
        setFormData(initial);
      })
      .catch(() => setError('Permit type not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (asDraft) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const app = await applicationsApi.create({
        permitTypeId: permitType.id,
        formData,
        submit: !asDraft,
      });
      navigate(asDraft ? '/applications' : `/applications/${app.id}`);
    } catch (err) {
      setError(err.json?.message || err.body || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading form…</div>;
  if (error && !permitType) return <div className="page-error">{error}</div>;
  if (!permitType) return null;

  const fields = permitType.formSchema?.fields || [];

  return (
    <div className="application-form-page">
      <h1>{permitType.name}</h1>
      {permitType.description && <p className="form-description">{permitType.description}</p>}
      {error && <div className="form-error">{error}</div>}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}
        className="application-form"
      >
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            {f.required && <span className="required"> *</span>}
            {f.type === 'textarea' ? (
              <textarea
                value={formData[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                required={f.required}
                rows={4}
              />
            ) : (
              <input
                type={f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : 'text'}
                value={formData[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                required={f.required}
              />
            )}
          </label>
        ))}
        <div className="form-actions">
          <button type="button" onClick={() => handleSubmit(true)} disabled={submitting}>
            Save draft
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      </form>
    </div>
  );
}
