import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

const PricingManager: React.FC = () => {
    const [logic, setLogic] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedComplexity, setSelectedComplexity] = useState('Basic');

    const fetchPricing = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getPricing();
            if (data && data.length > 0) {
                setLogic(data[0]);
            } else {
                setLogic({
                    baseRate: 45,
                    complexityBasic: 1,
                    complexityMedium: 1.5,
                    complexityHigh: 2.2,
                    rateMotion: 100,
                    rateExplainer: 150,
                    rateProduction: 120,
                    rateThreeD: 200,
                    deliveryDaysBasic: 2,
                    deliveryDaysMedium: 4,
                    deliveryDaysHigh: 7,
                    urgentMultiplier: 0.7
                });
            }
        } catch (err) {
            console.error("Failed to fetch pricing:", err);
            setLogic({
                baseRate: 45,
                complexityBasic: 1,
                complexityMedium: 1.5,
                complexityHigh: 2.2,
                rateMotion: 100,
                rateExplainer: 150,
                rateProduction: 120,
                rateThreeD: 200,
                deliveryDaysBasic: 2,
                deliveryDaysMedium: 4,
                deliveryDaysHigh: 7,
                urgentMultiplier: 0.7
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Ensure all critical fields are mapped to PascalCase for .NET compatibility
            const payload = {
                ...logic,
                Id: logic.id || logic.Id || 0,
                BaseRate: logic.baseRate || logic.BaseRate || 45,
                ComplexityBasic: logic.complexityBasic || logic.ComplexityBasic || 1,
                ComplexityMedium: logic.complexityMedium || logic.ComplexityMedium || 1.5,
                ComplexityHigh: logic.complexityHigh || logic.ComplexityHigh || 2.2,
                RateMotion: logic.rateMotion || logic.RateMotion || 100,
                RateExplainer: logic.rateExplainer || logic.RateExplainer || 150,
                RateProduction: logic.rateProduction || logic.RateProduction || 120,
                RateThreeD: logic.rateThreeD || logic.RateThreeD || 200,
                DeliveryDaysBasic: logic.deliveryDaysBasic || logic.DeliveryDaysBasic || 2,
                DeliveryDaysMedium: logic.deliveryDaysMedium || logic.DeliveryDaysMedium || 4,
                DeliveryDaysHigh: logic.deliveryDaysHigh || logic.DeliveryDaysHigh || 7,
                UrgentMultiplier: logic.urgentMultiplier || logic.UrgentMultiplier || 0.7
            };

            const id = payload.Id;
            if (id && id !== 0) {
                await apiService.updatePricing(id.toString(), payload);
            } else {
                await apiService.createPricing(payload);
            }
            alert("Pricing engine configurations updated successfully!");
            fetchPricing();
        } catch (err: any) {
            console.error("Pricing Save Error:", err.response?.data || err.message);
            alert(`Failed to save: ${err.response?.data?.title || "Database synchronization error"}`);
        }
    };

    const handleChange = (field: string, value: any) => {
        // Update both casings to be safe
        const pascalField = field.charAt(0).toUpperCase() + field.slice(1);
        setLogic({ ...logic, [field]: value, [pascalField]: value });
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    if (loading || !logic) return <div className="p-5 text-center">Synchronizing Pricing Logic...</div>;

    const currentDeliveryDays = logic[`deliveryDays${selectedComplexity}`] !== undefined 
        ? logic[`deliveryDays${selectedComplexity}`] 
        : (logic[`DeliveryDays${selectedComplexity}`] || 0);

    return (
        <div className="animate-fade-in">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-title">Pricing & Delivery Engine</h2>
                    <p className="admin-subtitle">Calibrate the mathematical models for project estimation.</p>
                </div>
                <button className="btn-admin-primary" onClick={handleSave}>
                    <i className="fas fa-save me-2"></i> Commit Changes
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="admin-card h-100">
                        <h4 className="fw-800 mb-4 border-bottom pb-2 text-white">Complexity Multipliers</h4>
                        <div className="d-flex flex-column gap-3">
                            {[
                                { label: 'Basic', field: 'complexityBasic' },
                                { label: 'Medium', field: 'complexityMedium' },
                                { label: 'High', field: 'complexityHigh' }
                            ].map((item) => (
                                <div 
                                    key={item.field} 
                                    className={`p-3 bg-soft-light rounded-4 d-flex justify-content-between align-items-center cursor-pointer transition-all ${selectedComplexity === item.label ? 'active-comp-card' : ''}`}
                                    onClick={() => setSelectedComplexity(item.label)}
                                >
                                    <span className={`fw-700 ${selectedComplexity === item.label ? 'text-accent' : ''}`}>{item.label}</span>
                                    <input 
                                        type="number" step="0.1" className="admin-input-small" 
                                        value={logic[item.field] || logic[item.field.charAt(0).toUpperCase() + item.field.slice(1)] || 0} 
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleChange(item.field, parseFloat(e.target.value))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="admin-card h-100">
                        <h4 className="fw-800 mb-4 border-bottom pb-2 text-white">Service Unit Rates</h4>
                        <div className="d-flex flex-column gap-3">
                            {[
                                { label: 'Motion Graphics', field: 'rateMotion' },
                                { label: 'Explainer Video', field: 'rateExplainer' },
                                { label: 'Video Production', field: 'rateProduction' },
                                { label: '3D Animation', field: 'rateThreeD' }
                            ].map((item) => (
                                <div key={item.field} className="p-3 bg-soft-light rounded-4 d-flex justify-content-between align-items-center">
                                    <span className="fw-700">{item.label}</span>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-7 text-muted">$</span>
                                        <input 
                                            type="number" className="admin-input-small" 
                                            value={logic[item.field] || logic[item.field.charAt(0).toUpperCase() + item.field.slice(1)] || 0} 
                                            onChange={(e) => handleChange(item.field, parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="admin-card h-100">
                        <h4 className="fw-800 mb-4 border-bottom pb-2 text-white">Delivery Logic</h4>
                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 bg-soft-light rounded-4 active-delivery-card">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-700 text-accent">{selectedComplexity} Delivery</span>
                                    <input 
                                        type="number" className="admin-input-small" 
                                        value={currentDeliveryDays} 
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            const fieldName = `deliveryDays${selectedComplexity}`;
                                            const pascalField = `DeliveryDays${selectedComplexity}`;
                                            setLogic({ ...logic, [fieldName]: val, [pascalField]: val });
                                        }}
                                    />
                                </div>
                                <p className="text-muted fs-11 m-0">Base days per 30s of {selectedComplexity.toLowerCase()} work.</p>
                            </div>
                            
                            <div className="p-3 bg-soft-light rounded-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-700">Urgent Factor</span>
                                    <input 
                                        type="number" step="0.1" className="admin-input-small" 
                                        value={logic.urgentMultiplier || logic.UrgentMultiplier || 0} 
                                        onChange={(e) => handleChange('urgentMultiplier', parseFloat(e.target.value))}
                                    />
                                </div>
                                <p className="text-muted fs-11 m-0">Time multiplier for rush orders (e.g. 0.7 = 30% faster).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-soft-light { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; }
                .active-comp-card { border-color: var(--color-primary) !important; background: rgba(255, 174, 0, 0.05) !important; }
                .active-delivery-card { border: 1px solid var(--color-primary) !important; background: rgba(255, 174, 0, 0.05) !important; }
                .text-accent { color: var(--color-primary) !important; }
                .admin-input-small {
                    width: 90px;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 10px;
                    text-align: center;
                    font-weight: 800;
                    transition: all 0.3s;
                }
                .admin-input-small:focus { border-color: var(--color-primary); outline: none; background: #000; }
                .fs-7 { font-size: 0.85rem; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default PricingManager;
