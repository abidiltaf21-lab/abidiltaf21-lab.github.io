import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

const ReviewManager: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getReviews();
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const reviewToApprove = reviews.find(r => (r._id || r.id).toString() === id.toString());
            if (!reviewToApprove) return;
            
            const updatedReview = {
                ...reviewToApprove,
                status: 'approved',
                isApproved: true
            };
            
            await apiService.updateReview(id, updatedReview);
            setReviews(prev => prev.map(r => (r._id || r.id).toString() === id.toString() ? updatedReview : r));
        } catch (err) {
            alert("Failed to approve review");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            try {
                await apiService.deleteReview(id);
                setReviews(prev => prev.filter(r => (r._id || r.id).toString() !== id.toString()));
            } catch (err) {
                alert("Failed to delete review");
            }
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-title">Review Moderation</h2>
                    <p className="admin-subtitle">Curate and approve client testimonials for public display.</p>
                </div>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="text-center p-5">Loading Reviews...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Feedback</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => {
                                    const reviewId = review._id || review.id;
                                    const isPending = review.status?.toLowerCase() === 'pending';
                                    const isApproved = review.status?.toLowerCase() === 'approved' || review.isApproved;
                                    return (
                                        <tr key={reviewId}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img 
                                                        src={review.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author || 'Client')}&background=random`} 
                                                        className="rounded-circle"
                                                        style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', objectFit: 'cover' }}
                                                        alt="" 
                                                    />
                                                    <span className="fw-700">{review.author}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="text-muted">{review.project || 'General'}</span>
                                                    {review.website && (
                                                        <a href={review.website} target="_blank" rel="noopener noreferrer" className="text-primary fs-11 text-decoration-none">
                                                            <i className="fas fa-globe me-1"></i>Website
                                                        </a>
                                                    )}
                                                    {review.socialLink && (
                                                        <a href={review.socialLink} target="_blank" rel="noopener noreferrer" className="text-info fs-11 text-decoration-none mt-1">
                                                            <i className="fab fa-linkedin me-1"></i>Profile
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td><p className="m-0 fs-7 italic" style={{maxWidth: '300px'}}>"{review.text}"</p></td>
                                            <td>
                                                <span className={`badge bg-soft-${isApproved ? 'success' : 'warning'}`}>
                                                    {review.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    {isPending && (
                                                        <button className="btn-action edit text-success" onClick={() => handleApprove(reviewId)}>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}
                                                    <button className="btn-action delete" onClick={() => handleDelete(reviewId)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManager;
