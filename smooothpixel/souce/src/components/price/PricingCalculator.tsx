import React, { useEffect, useState, useMemo } from 'react';
import ReactWOW from 'react-wow';
import { apiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const PricingCalculator: React.FC = () => {
    const { t } = useLanguage();
    const [logic, setLogic] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [projectType, setProjectType] = useState<string>('animation');
    const [duration, setDuration] = useState(30); // seconds
    const [complexity, setComplexity] = useState(1); // 1 to 3
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data } = await apiService.getPricing();
                if (data && data.length > 0) {
                    setLogic(data[0]);
                } else {
                    setLogic({
                        rateMotion: 100,
                        rateExplainer: 150,
                        rateThreeD: 200,
                        complexityBasic: 1,
                        complexityMedium: 1.5,
                        complexityHigh: 2.2,
                        deliveryBaseDays: 2,
                        urgentMultiplier: 0.7
                    });
                }
            } catch (err) {
                console.error("Failed to fetch pricing logic:", err);
                setLogic({
                    rateMotion: 100,
                    rateExplainer: 150,
                    rateThreeD: 200,
                    complexityBasic: 1,
                    complexityMedium: 1.5,
                    complexityHigh: 2.2,
                    deliveryBaseDays: 2,
                    urgentMultiplier: 0.7
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPricing();
    }, []);

    const totalPrice = useMemo(() => {
        if (!logic) return 0;
        
        // Map rate from logic
        const rateMap: any = {
            animation: logic.rateMotion ?? logic.RateMotion ?? 100,
            explainer: logic.rateExplainer ?? logic.RateExplainer ?? 150,
            '3d': logic.rateThreeD ?? logic.RateThreeD ?? 200
        };
        
        // Map complexity from logic
        const multMap: any = {
            1: logic.complexityBasic ?? logic.ComplexityBasic ?? 1,
            2: logic.complexityMedium ?? logic.ComplexityMedium ?? 1.5,
            3: logic.complexityHigh ?? logic.ComplexityHigh ?? 2.2
        };

        const rate = rateMap[projectType] || 100;
        const mult = multMap[complexity] || 1;
        
        // Basic calculation: (Rate per 30s) * (Units of 30s) * Multiplier
        let price = rate * (duration / 30) * mult;
        if (isUrgent) price *= 1.3; 
        return Math.round(price);
    }, [logic, projectType, duration, complexity, isUrgent]);

    const deliveryDays = useMemo(() => {
        if (!logic) return 0;
        
        // Map complexity level to specific delivery base days from backend
        const compMap: any = {
            1: logic.deliveryDaysBasic || logic.DeliveryDaysBasic || 2,
            2: logic.deliveryDaysMedium || logic.DeliveryDaysMedium || 4,
            3: logic.deliveryDaysHigh || logic.DeliveryDaysHigh || 7
        };
        
        const base = compMap[complexity] || 2;
        const urgentFactor = logic.urgentMultiplier || logic.UrgentMultiplier || 0.7;
        
        // Time estimate: (Units of 30s) * Base Days for selected complexity
        let days = (duration / 30) * base;
        if (isUrgent) days *= urgentFactor;
        
        return Math.ceil(days);
    }, [logic, duration, complexity, isUrgent]);

    if (loading) return null;

    return (
        <section id="calculator" className="calculator-area default-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <ReactWOW animation="fadeInLeft">
                            <div className="calculator-info">
                                <h4 className="sub-title">{t('cost_estimator')}</h4>
                                <h2 className="title text-white">{t('investment_visualization')}</h2>
                                <p className="text-muted">
                                    {t('calculator_desc')}
                                </p>
                                <div className="metric-grid mt-5">
                                    <div className="metric-item glass-panel sp-card">
                                        <h3 className="text-accent">${totalPrice}</h3>
                                        <span>{t('estimated_total')}</span>
                                    </div>
                                    <div className="metric-item glass-panel sp-card">
                                        <h3>{deliveryDays}</h3>
                                        <span>{t('estimated_delivery')}</span>
                                    </div>
                                </div>
                            </div>
                        </ReactWOW>
                    </div>

                    <div className="col-lg-6">
                        <ReactWOW animation="fadeInRight">
                            <div className="calculator-card glass-panel sp-card p-5">
                                <div className="form-section mb-4">
                                    <label className="form-label-premium">{t('project_stream')}</label>
                                    <div className="type-selector">
                                        {(['animation', 'explainer', '3d'] as const).map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setProjectType(type)}
                                                className={`type-btn ${projectType === type ? 'active' : ''}`}
                                            >
                                                {t('stream_' + type).toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-section mb-4">
                                    <label className="form-label-premium d-flex justify-content-between">
                                        {t('temporal_duration')} <span>{duration}s</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="15" 
                                        max="180" 
                                        step="15"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="range-input-v2"
                                    />
                                </div>

                                <div className="form-section mb-4">
                                    <label className="form-label-premium">{t('structural_complexity')}</label>
                                    <div className="complexity-grid">
                                        {[1, 2, 3].map(level => (
                                            <button 
                                                key={level}
                                                onClick={() => setComplexity(level)}
                                                className={`level-btn ${complexity === level ? 'active' : ''}`}
                                            >
                                                {t('level')} {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-section mb-5 d-flex align-items-center justify-content-between">
                                    <div>
                                        <label className="text-white fw-700 m-0">{t('accelerated_deployment')}</label>
                                        <p className="text-muted fs-11 m-0">{t('fast_turnaround_desc')}</p>
                                    </div>
                                    <div 
                                        className={`toggle-v2 ${isUrgent ? 'active' : ''}`}
                                        onClick={() => setIsUrgent(!isUrgent)}
                                    >
                                        <div className="toggle-handle"></div>
                                    </div>
                                </div>

                                <button className="btn-neon w-100 justify-content-center">
                                    <span>{t('initiate_quote')}</span> <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </ReactWOW>
                    </div>
                </div>
            </div>

            <style>{`
                /* ========= CALCULATOR AREA ========= */
                .calculator-area { 
                    background: #fff; 
                    border-radius: 30px;
                    border: 1px solid rgba(0,0,0,0.02);
                    box-shadow: var(--box-shadow-primary);
                    padding: 80px 0;
                }
                .main-content-area .calculator-area { 
                    background: #111; 
                    border-color: rgba(255,255,255,0.05);
                    box-shadow: 0 20px 80px rgba(0,0,0,0.4);
                }

                /* ========= LABELS ========= */
                .form-label-premium {
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #1e293b;
                    margin-bottom: 15px;
                    display: block;
                }
                .main-content-area .form-label-premium { color: #e2e8f0; }

                .calculator-info .sub-title { color: var(--color-primary); }
                .calculator-info .title { color: #0f172a; }
                .main-content-area .calculator-info .title { color: #fff; }
                .calculator-info .text-muted { color: #64748b !important; font-size: 16px; line-height: 1.7; }
                .main-content-area .calculator-info .text-muted { color: #94a3b8 !important; }

                .text-accent { color: var(--color-primary); }

                /* ========= CALCULATOR CARD ========= */
                .calculator-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                }
                .main-content-area .calculator-card {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.08);
                }

                /* ========= METRIC GRID ========= */
                .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .metric-item { 
                    padding: 35px; 
                    text-align: center; 
                    background: #f1f5f9;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.4s ease;
                }
                .metric-item:hover { transform: translateY(-5px); border-color: var(--color-primary); }
                .main-content-area .metric-item { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
                .metric-item h3 { font-size: 36px; font-weight: 900; margin-bottom: 8px; color: #0f172a; letter-spacing: -1px; }
                .main-content-area .metric-item h3 { color: #fff; }
                .metric-item span { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; font-weight: 800; }
                .main-content-area .metric-item span { color: #94a3b8; }

                /* ========= TYPE SELECTOR ========= */
                .type-selector { display: flex; gap: 10px; }
                .type-btn {
                    flex: 1;
                    padding: 14px;
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                    border-radius: 14px;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .type-btn:hover { background: #e2e8f0; transform: scale(1.02); }
                .main-content-area .type-btn {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.12);
                    color: #cbd5e1;
                }
                .main-content-area .type-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
                .type-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); box-shadow: 0 10px 20px rgba(255, 174, 0, 0.2); }

                /* ========= RANGE SLIDER ========= */
                .range-input-v2 {
                    width: 100%;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 10px;
                    appearance: none;
                    outline: none;
                }
                .main-content-area .range-input-v2 { background: rgba(255,255,255,0.12); }
                .range-input-v2::-webkit-slider-thumb {
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 15px rgba(255, 174, 0, 0.4);
                    transition: transform 0.2s ease;
                }
                .range-input-v2::-webkit-slider-thumb:hover { transform: scale(1.15); }

                /* ========= COMPLEXITY ========= */
                .complexity-grid { display: flex; gap: 10px; }
                .level-btn {
                    flex: 1;
                    padding: 12px;
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .main-content-area .level-btn {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.12);
                    color: #cbd5e1;
                }
                .main-content-area .level-btn:hover { color: #fff; }
                .level-btn.active { border-color: var(--color-primary); color: var(--color-primary); background: rgba(255, 174, 0, 0.08); }

                /* ========= TOGGLE ========= */
                .toggle-v2 {
                    width: 50px;
                    height: 26px;
                    background: #cbd5e1;
                    border-radius: 100px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .main-content-area .toggle-v2 { background: rgba(255,255,255,0.2); }
                .toggle-v2.active { background: var(--color-primary); }
                .toggle-handle {
                    width: 20px;
                    height: 20px;
                    background: #fff;
                    border-radius: 50%;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                }
                .toggle-v2.active .toggle-handle { transform: translateX(24px); }

                /* ========= URGENT LABEL FIX ========= */
                .calculator-card .fw-700 { color: #0f172a; font-weight: 700; }
                .main-content-area .calculator-card .fw-700 { color: #fff; }
                .calculator-card .fs-11 { color: #64748b !important; }
                .main-content-area .calculator-card .fs-11 { color: #94a3b8 !important; }
            `}</style>
        </section>
    );
};

export default PricingCalculator;
