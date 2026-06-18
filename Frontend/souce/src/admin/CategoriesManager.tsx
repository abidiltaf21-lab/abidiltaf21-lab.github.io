import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useProjects } from '../hooks/useProjects';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const CategoriesManager: React.FC = () => {
    const { categories, refetch, loading } = useCategories();
    const { projects } = useProjects();
    const [newCategory, setNewCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate node associations based on existing projects
    const getCategoryCount = (categoryName: string) => {
        return projects.filter(p => {
            const rawTags = Array.isArray(p.tags) ? p.tags : 
                            (p.Tags ? (typeof p.Tags === 'string' ? p.Tags.split(',') : []) : 
                            (p.tags ? (typeof p.tags === 'string' ? p.tags.split(',') : []) : []));
            const tags = rawTags.map((t: string) => t.trim().toLowerCase());
            return tags.includes(categoryName.toLowerCase());
        }).length;
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) return toast.error('Please enter a category name');
        
        setIsSubmitting(true);
        try {
            const payload = {
                Name: newCategory.trim(),
                IsActive: true,
                SortOrder: categories.length
            };
            await apiService.createCategory(payload);
            toast.success('Category successfully registered!');
            setNewCategory('');
            refetch();
        } catch (error: any) {
            console.error('Error creating category:', error);
            toast.error('Failed to register category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
            try {
                await apiService.deleteCategory(id.toString());
                toast.success('Category removed');
                refetch();
            } catch (error: any) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="text-white mb-2 fw-800 fs-1" style={{ letterSpacing: '-1.5px' }}>Taxonomy Control</h1>
                    <p className="text-muted m-0 fs-6">Organize and distribute your assets across dynamic database categories.</p>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xl-4 col-lg-5">
                    <div className="glass-panel p-4">
                        <h5 className="text-white mb-4 fw-700">Index New Category</h5>
                        <div className="mb-4">
                            <label className="form-label-premium">Category Label</label>
                            <input 
                                type="text" 
                                className="form-input-premium" 
                                value={newCategory} 
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. VFX Simulation" 
                            />
                        </div>
                        <button 
                            className="btn-neon w-100 justify-content-center"
                            onClick={handleCreateCategory}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>} Register Category
                        </button>
                        <div className="mt-4 p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                            <p className="text-muted m-0 fs-12 line-height-sm">
                                <i className="fas fa-info-circle me-2 text-primary"></i>
                                These categories are loaded directly into the "My Recent Work" filtering system on the public portfolio.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-8 col-lg-7">
                    <div className="glass-panel p-4">
                        <h5 className="text-white mb-4 fw-700">Distribution Mapping</h5>
                        <div className="category-list-v2">
                            {loading ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-circle-notch fa-spin text-primary fs-3"></i>
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-14">No taxonomies indexed yet.</p>
                                </div>
                            ) : (
                                categories.map((cat, idx) => (
                                    <div key={cat.id || cat.Id} className="category-row-v2 d-flex align-items-center justify-content-between p-3 mb-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="cat-icon-v2" style={{ background: COLORS[idx % COLORS.length] + '20', color: COLORS[idx % COLORS.length] }}>
                                                <i className="fas fa-hashtag"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-white m-0 fw-700">{cat.name || cat.Name}</h6>
                                                <span className="text-muted fs-12">{getCategoryCount(cat.name || cat.Name)} Associated Projects</span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="action-btn-mini delete"
                                                onClick={() => handleDeleteCategory(cat.id || cat.Id, cat.name || cat.Name)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fs-12 { font-size: 12px; }
                .line-height-sm { line-height: 1.4; }
                
                .category-row-v2 {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 16px;
                    transition: var(--transition-smooth);
                }
                .category-row-v2:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: var(--admin-accent);
                    transform: translateX(10px);
                }

                .cat-icon-v2 {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .action-btn-mini {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-smooth);
                    cursor: pointer;
                }
                .action-btn-mini:hover { background: var(--admin-accent); color: #fff; border-color: var(--admin-accent); }
                .action-btn-mini.delete:hover { background: var(--admin-pink); border-color: var(--admin-pink); }
            `}</style>
        </div>
    );
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b'];

export default CategoriesManager;
