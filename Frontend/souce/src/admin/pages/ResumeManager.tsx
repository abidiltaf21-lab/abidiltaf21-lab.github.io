import React, { useCallback, useEffect, useState } from 'react';
import { apiService } from '../../services/api';

type ResumeType = 'experience' | 'education';

interface ResumeForm {
    type: ResumeType;
    title: string;
    subtitle: string;
    dateRange: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
}

const emptyForm = (): ResumeForm => ({
    type: 'experience',
    title: '',
    subtitle: '',
    dateRange: '',
    description: '',
    sortOrder: 0,
    isActive: true,
});

const ResumeManager: React.FC = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | ResumeType>('all');
    const [showModal, setShowModal] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [form, setForm] = useState<ResumeForm>(emptyForm());

    const normalize = (raw: Record<string, unknown>) => ({
        id: Number(raw.id ?? raw.Id ?? 0),
        type: (String(raw.type ?? raw.Type ?? 'experience').toLowerCase() === 'education'
            ? 'education'
            : 'experience') as ResumeType,
        title: String(raw.title ?? raw.Title ?? ''),
        subtitle: String(raw.subtitle ?? raw.Subtitle ?? ''),
        dateRange: String(raw.dateRange ?? raw.DateRange ?? ''),
        description: String(raw.description ?? raw.Description ?? ''),
        sortOrder: Number(raw.sortOrder ?? raw.SortOrder ?? 0),
        isActive: raw.isActive ?? raw.IsActive ?? true,
    });

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getResumeEntries({ includeInactive: true });
            const list = Array.isArray(data) ? data.map((r: Record<string, unknown>) => normalize(r)) : [];
            list.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
            setEntries(list);
        } catch (err) {
            console.error('Failed to load resume entries:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const filtered = entries.filter((e) => filter === 'all' || e.type === filter);

    const openAdd = (type: ResumeType) => {
        setCurrentId(null);
        setForm({ ...emptyForm(), type, sortOrder: entries.filter((e) => e.type === type).length + 1 });
        setShowModal(true);
    };

    const openEdit = (entry: ReturnType<typeof normalize>) => {
        setCurrentId(entry.id);
        setForm({
            type: entry.type,
            title: entry.title,
            subtitle: entry.subtitle,
            dateRange: entry.dateRange,
            description: entry.description,
            sortOrder: entry.sortOrder,
            isActive: Boolean(entry.isActive),
        });
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: currentId ?? 0,
            type: form.type,
            title: form.title.trim(),
            subtitle: form.subtitle.trim(),
            dateRange: form.dateRange.trim(),
            description: form.description.trim(),
            sortOrder: form.sortOrder,
            isActive: form.isActive,
        };

        try {
            if (currentId) {
                await apiService.updateResumeEntry(currentId, payload);
            } else {
                await apiService.addResumeEntry(payload);
            }
            setShowModal(false);
            fetchEntries();
        } catch {
            alert('Failed to save resume entry.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this resume entry?')) return;
        try {
            await apiService.deleteResumeEntry(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
        } catch {
            alert('Failed to delete entry.');
        }
    };

    return (
        <div className="admin-page resume-manager-page">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="admin-page-title mb-1">Resume & Timeline</h1>
                    <p className="text-muted mb-0 small">
                        Manage experience and education shown on the public Resume section.
                    </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => openAdd('experience')}>
                        + Experience
                    </button>
                    <button type="button" className="btn btn-admin-primary btn-sm" onClick={() => openAdd('education')}>
                        + Education
                    </button>
                </div>
            </div>

            <div className="admin-card p-3 mb-4 d-flex gap-2 flex-wrap">
                {(['all', 'experience', 'education'] as const).map((key) => (
                    <button
                        key={key}
                        type="button"
                        className={`btn btn-sm ${filter === key ? 'btn-admin-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setFilter(key)}
                    >
                        {key === 'all' ? 'All' : key === 'experience' ? 'Experience' : 'Education'}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-muted">Loading…</p>
            ) : filtered.length === 0 ? (
                <div className="admin-card p-5 text-center text-muted">No entries yet. Add experience or education above.</div>
            ) : (
                <div className="row g-3">
                    {filtered.map((entry) => (
                        <div className="col-md-6 col-xl-4" key={entry.id}>
                            <div className="admin-card p-4 h-100 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                    <span className={`badge ${entry.type === 'experience' ? 'bg-primary' : 'bg-info'}`}>
                                        {entry.type}
                                    </span>
                                    <span className="small text-muted">Order {entry.sortOrder}</span>
                                </div>
                                <h5 className="fw-bold mb-1">{entry.title}</h5>
                                <p className="small text-muted mb-1">{entry.subtitle}</p>
                                <span className="badge rounded-pill text-bg-warning text-dark align-self-start mb-2">
                                    {entry.dateRange}
                                </span>
                                <p className="small flex-grow-1" style={{ lineHeight: 1.5 }}>
                                    {entry.description.length > 140
                                        ? `${entry.description.slice(0, 140)}…`
                                        : entry.description}
                                </p>
                                <div className="d-flex gap-2 mt-3">
                                    <button type="button" className="btn btn-sm btn-outline-primary flex-fill" onClick={() => openEdit(entry)}>
                                        Edit
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(entry.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} role="dialog">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <form className="modal-content admin-card" onSubmit={handleSave}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title">{currentId ? 'Edit' : 'Add'} Resume Entry</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            value={form.type}
                                            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ResumeType }))}
                                        >
                                            <option value="experience">Experience</option>
                                            <option value="education">Education</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Sort order</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.sortOrder}
                                            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Title</label>
                                        <input
                                            className="form-control"
                                            required
                                            value={form.title}
                                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                            placeholder="Senior Motion Designer"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Company / Institution</label>
                                        <input
                                            className="form-control"
                                            required
                                            value={form.subtitle}
                                            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date range</label>
                                        <input
                                            className="form-control"
                                            required
                                            value={form.dateRange}
                                            onChange={(e) => setForm((f) => ({ ...f, dateRange: e.target.value }))}
                                            placeholder="2015 - Present"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            required
                                            value={form.description}
                                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={form.isActive}
                                                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                                                id="resume-active"
                                            />
                                            <label className="form-check-label" htmlFor="resume-active">
                                                Visible on website
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-admin-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeManager;
