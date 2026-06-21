import { useEffect, useRef } from 'react';

/**
 * ServerWakeUp Component
 * ----------------------
 * دا component د Render.com Free Plan د "Cold Start" ستونزې لپاره جوړ شوی.
 * 
 * Render Free Plan کی سرور ۱۵ دقیقو وروسته sleep کیږي.
 * دا component:
 *  1. کله چی app پیل شي، سمدستي backend ته ping کوي (wake up)
 *  2. هر ۱۰ دقیقو کی بیا ping کوي چی سرور نه ویده شي
 */
const ServerWakeUp = () => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasWokenRef = useRef(false);

    const pingServer = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
            // د /api/health endpoint ته ping — که نه وي، /api/projects کار کوي
            const pingUrl = baseUrl.startsWith('http')
                ? `${baseUrl}/health`
                : `${window.location.origin}${baseUrl}/health`;

            const response = await fetch(pingUrl, {
                method: 'GET',
                signal: AbortSignal.timeout(5000), // 5 سیکنده timeout
            });

            if (response.ok && !hasWokenRef.current) {
                hasWokenRef.current = true;
                console.log('[ServerWakeUp] ✅ Backend is awake!');
            }
        } catch {
            // Silent fail — د network error کی هیڅ نه کوو
        }
    };

    useEffect(() => {
        // سمدستي ping — د page load سره
        pingServer();

        // هر ۱۰ دقیقو کی ping (600,000ms)
        intervalRef.current = setInterval(pingServer, 10 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // دا component هیڅ UI نه ښیي
    return null;
};

export default ServerWakeUp;
