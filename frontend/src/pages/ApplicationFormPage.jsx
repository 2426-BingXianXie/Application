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
          initial[f.name] = f.type === 'checkbox' ? false : '';
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

  // Group fields by section for display (null/empty section = no header)
  const bySection = fields.reduce((acc, f) => {
    const section = f.section || '';
    if (!acc[section]) acc[section] = [];
    acc[section].push(f);
    return acc;
  }, {});

  const sectionOrder = [...new Set(fields.map((f) => f.section || ''))];

  function renderField(f) {
    const value = formData[f.name];
    const commonLabel = (
      <>
        {f.label}
        {f.required && <span className="required"> *</span>}
      </>
    );

    if (f.type === 'textarea') {
      return (
        <label key={f.name}>
          {commonLabel}
          <textarea
            value={value ?? ''}
            onChange={(e) => handleChange(f.name, e.target.value)}
            required={f.required}
            rows={4}
          />
        </label>
      );
    }

    if (f.type === 'select') {
      return (
        <label key={f.name}>
          {commonLabel}
          <select
            value={value ?? ''}
            onChange={(e) => handleChange(f.name, e.target.value)}
            required={f.required}
          >
            <option value="">Select…</option>
            {(f.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      );
    }

    if (f.type === 'checkbox') {
      return (
        <label key={f.name} className="form-field-checkbox">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleChange(f.name, e.target.checked)}
            required={f.required}
          />
          <span>{commonLabel}</span>
        </label>
      );
    }

    const inputType = f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text';
    return (
      <label key={f.name}>
        {commonLabel}
        <input
          type={inputType}
          value={value ?? ''}
          onChange={(e) => handleChange(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          required={f.required}
        />
      </label>
    );
  }

  return (
    <div className="application-form-page">
      <h1>{permitType.name}</h1>
      {permitType.description && <p className="form-description">{permitType.description}</p>}
      {error && <div className="form-error">{error}</div>}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}
        className="application-form"
      >
        {sectionOrder.map((section) => (
          <div key={section || '_none'} className="form-section">
            {section && <h3 className="form-section-title">{section}</h3>}
            {bySection[section].map(renderField)}
          </div>
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
