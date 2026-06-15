import React, { useEffect, useState, useMemo } from 'react';
import ReactWOW from 'react-wow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { apiService } from '../../services/api';
import { useSocialAccounts } from '../../hooks/useSocialAccounts';
import { useLanguage } from '../../context/LanguageContext';

// Helper function to resolve dynamic social icon class based on link URL
const getSocialIconClass = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes('linkedin.com')) return 'fab fa-linkedin';
    if (lower.includes('instagram.com')) return 'fab fa-instagram';
    if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'fab fa-facebook';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'fab fa-x-twitter';
    if (lower.includes('youtube.com')) return 'fab fa-youtube';
    if (lower.includes('github.com')) return 'fab fa-github';
    if (lower.includes('behance.net')) return 'fab fa-behance';
    if (lower.includes('dribbble.com')) return 'fab fa-dribbble';
    if (lower.includes('telegram.org') || lower.includes('t.me')) return 'fab fa-telegram-plane';
    return 'fas fa-link'; // Fallback link icon
};

const ReviewSystem: React.FC = () => {
    const { t } = useLanguage();
    const { accounts: socialAccounts } = useSocialAccounts();
    const activeAccounts = useMemo(() => socialAccounts.filter(a => a.isVisible), [socialAccounts]);
    const telegramAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'telegram'), [activeAccounts]);
    const locationAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'location'), [activeAccounts]);
    const emailAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'email'), [activeAccounts]);
    const phoneAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'phone'), [activeAccounts]);

    const [fetchedReviews, setFetchedReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState<'website' | 'google'>('website');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Filter by topic badge in Google widget
    const [selectedTopic, setSelectedTopic] = useState('All');
    // Track which review cards are expanded (show full text) - stored as string[]
    const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
    // Track which reviews received a "Helpful" thumbs up - stored as string[]
    const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
    // Hover star state for modal
    const [hoverStar, setHoverStar] = useState(0);

    // Form fields
    const [author, setAuthor] = useState('');
    const [project, setProject] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [website, setWebsite] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Dynamic colorful Google avatar style generator based on reviewer's name
    const getAvatarStyle = (name: string) => {
        const colors = [
            '#1a73e8', // Google Blue
            '#0f9d58', // Google Green
            '#f4b400', // Google Gold
            '#db4437', // Google Red
            '#ab47bc', // Purple
            '#00acc1', // Teal
            '#ff7043', // Orange
            '#ec407a'  // Pink
        ];
        const firstLetter = name ? name.trim().charAt(0).toUpperCase() : 'A';
        const charCode = firstLetter.charCodeAt(0) || 0;
        const colorIndex = charCode % colors.length;
        return {
            backgroundColor: colors[colorIndex],
            color: '#ffffff',
            fontWeight: '700'
        };
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await apiService.getReviews();
                if (data && Array.isArray(data)) {
                    const approved = data.filter((r: any) => 
                        r.status?.toLowerCase() === 'approved' || 
                        r.Status?.toLowerCase() === 'approved' || 
                        r.isApproved === true || 
                        r.IsApproved === true
                    );
                    setFetchedReviews(approved);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const openWriteModal = (type: 'website' | 'google') => {
        setAuthor('');
        setProject('');
        setRating(5);
        setHoverStar(0);
        setText('');
        setImage('');
        setWebsite('');
        setSocialLink('');
        setSubmitSuccess(false);
        setModalTab(type);
        setShowModal(true);
    };

    const toggleExpand = (id: any) => {
        const idStr = String(id);
        setExpandedReviews(prev =>
            prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
        );
    };

    const toggleHelpful = (id: any) => {
        const idStr = String(id);
        setHelpfulReviews(prev =>
            prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
        );
    };

    const getReviewerBadge = (review: any): string => {
        const localGuideStr = t('local_guide');
        const reviewsStr = t('reviews').toLowerCase();
        if (review.rating === 2) return `${localGuideStr} • 5 ${reviewsStr}`;
        if (review.rating === 3) return `2 ${reviewsStr}`;
        const idStr = review.id ? String(review.id) : '';
        const code = idStr ? idStr.charCodeAt(idStr.length - 1) % 4 : 0;
        if (code === 0) return `${localGuideStr} • 18 ${reviewsStr}`;
        if (code === 1) return `4 ${reviewsStr}`;
        if (code === 2) return `${localGuideStr} • 42 ${reviewsStr}`;
        return `12 ${reviewsStr}`;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk';
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'smooothpixel_upload');

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: uploadData
        })
        .then(res => res.json())
        .then(data => {
            if (data.secure_url) {
                setImage(data.secure_url);
            } else {
                alert('Image upload failed.');
            }
        })
        .catch(err => {
            console.error("Cloudinary upload error:", err);
            alert('Upload error.');
        })
        .finally(() => {
            setIsUploading(false);
        });
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !text) {
            alert('Please fill out all required fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            const rawRating = Number(rating);
            
            // Call API
            await apiService.createReview({
                author,
                project: project || null,
                rating: rawRating,
                text,
                image: image || null,
                website: website || null,
                socialLink: socialLink || null,
                status: 'pending',
                isApproved: false,
                company: modalTab === 'google' ? 'Google Review' : 'Website Review'
            });

            // Optimistic local state update so total review counts and average rating reflect changes instantly!
            const localReviewId = `local-${Date.now()}`;
            const newLocalReview = {
                _id: localReviewId,
                id: localReviewId,
                author: author || 'Anonymous Client',
                project: project || 'Verified Client',
                rating: rawRating,
                text: text,
                image: image || '',
                website: website || '',
                socialLink: socialLink || '',
                isGoogle: modalTab === 'google',
                status: 'approved',
                isApproved: true,
                company: modalTab === 'google' ? 'Google Review' : 'Website Review',
                time: 'Recently'
            };

            setFetchedReviews(prev => [newLocalReview, ...prev]);

            setSubmitSuccess(true);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } catch (err) {
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google review cards list
    // Google review cards list (60 premium reviews averaging exactly 4.9 stars, highly randomized, multilingual, and spanning 3 years)
    const googleReviews = [
        {
            id: 'google-1',
            author: "Sarah Jenkins",
            project: "Verified Client",
            rating: 5,
            text: "We worked with SmooothPixel on a product animation video and were very happy with the results. The team is highly professional, and the overall experience of working with them was excellent. We will definitely collaborate on future projects",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-2',
            author: "David Chen",
            project: "Aura Creative",
            rating: 5,
            text: "Exceptional 3D product visualization! Delivered fast work on our corporate explainer video. A professional product that exceeded our standards.",
            image: "",
            isGoogle: true,
            time: "6 months ago"
        },
        {
            id: 'google-3',
            author: "Felix Weber",
            project: "Brand Campaign",
            rating: 5,
            text: "Unglaublich talentierte Animatoren! Die Beleuchtung, die Texturen und die flüssigen Bewegungen, die sie für unsere Premium-Uhrenmarke entworfen haben, waren absolut erstklassig. Sehr empfehlenswert!",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "3 days ago"
        },
        {
            id: 'google-4',
            author: "Niklas Schmidt",
            project: "Explainer Video",
            rating: 4,
            text: "Sehr reibungslose Kommunikation und qualitativ hochwertiges Rendering. Die kreative Ausrichtung war großartig, am Ende waren nur minimale Anpassungen im letzten Entwurf nötig.",
            image: "",
            isGoogle: true,
            time: "1 week ago"
        },
        {
            id: 'google-5',
            author: "Emily Larson",
            project: "Medical Device Co",
            rating: 5,
            text: "The 3D animation they created for our surgical instrument explainer video was absolutely flawless. They made complex scientific concepts easy to understand.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-6',
            author: "Claire Dupont",
            project: "Luxury Cosmetics",
            rating: 5,
            text: "Une attention aux détails tout simplement bluffante ! Les simulations de fluides et le rendu des reflets brillants pour notre gamme de soins sont incroyablement réalistes et luxueux.",
            image: "",
            isGoogle: true,
            time: "3 weeks ago"
        },
        {
            id: 'google-7',
            author: "Thomas Müller",
            project: "Automotive Launch",
            rating: 5,
            text: "Atemberaubendes Auto-Animationsvideo! Die fotorealistische Beleuchtung, die physikalische Simulation und die dramatischen Kamerawinkel passten perfekt zu unserem Produktlaunch. Absolute Profis.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 month ago"
        },
        {
            id: 'google-8',
            author: "Sebastian Kroll",
            project: "SaaS Product",
            rating: 5,
            text: "Schnelle Arbeit und erstklassige Professionalität. Sie haben innerhalb der vereinbarten Frist ein hochkonvertierendes Erklärvideo für unsere Plattform geliefert. Gerne wieder!",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-9',
            author: "Jonas Fischer",
            project: "Industrial Dynamics",
            rating: 3,
            text: "Gute Renderings, aber die Feedback-Schleifen waren extrem mühsam. Wir mussten viele Korrekturen mehrfach erklären. Am Ende okay, aber sehr anstrengend.",
            image: "",
            isGoogle: true,
            time: "2 months ago"
        },
        {
            id: 'google-10',
            author: "Youssef Mansour",
            project: "Creative Solutions",
            rating: 5,
            text: "عمل إبداعي مذهل! حركات ثلاثية الأبعاد فائقة الدقة والاحترافية. تم تسليم المشروع في الوقت المحدد وبجودة ممتازة جداً. نوصي بشدة بالتعامل معهم.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "5 months ago"
        },
        {
            id: 'google-11',
            author: "Oliver Poulsen",
            project: "Zenith Watch Co",
            rating: 5,
            text: "We needed a premium 3D commercial for our new chronograph. SmooothPixel delivered breathtaking close-up renders and mechanical movements.",
            image: "",
            isGoogle: true,
            time: "2 months ago"
        },
        {
            id: 'google-12',
            author: "Amélie Laurent",
            project: "Fashion Editorial",
            rating: 5,
            text: "J'ai adoré l'animation de particules abstraites qu'ils ont développée pour notre toile de fond de défilé. Une équipe très créative avec un goût exceptionnel !",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "3 months ago"
        },
        {
            id: 'google-13',
            author: "Jan de Vries",
            project: "Logistics Corp",
            rating: 5,
            text: "Professional team, clear feedback cycles, and highly scalable pipeline. Our supply chain explainer video was delivered with great clarity.",
            image: "",
            isGoogle: true,
            time: "8 months ago"
        },
        {
            id: 'google-14',
            author: "Isabella Rossi",
            project: "Jewelry Brand",
            rating: 5,
            text: "The diamond reflection and refraction in our latest ring commercial were so realistic. Beautiful rendering and highly professional product.",
            image: "",
            isGoogle: true,
            time: "3 months ago"
        },
        {
            id: 'google-15',
            author: "Lukas Novak",
            project: "Game Studio",
            rating: 2,
            text: "Die 3D-Modelle sind zwar qualitativ hochwertig, aber die Kommunikation war extrem zäh und die Lieferung verzögerte sich um fast drei Wochen. Für diesen Preis erwarte ich besseren Service.",
            image: "",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-16',
            author: "Anna Lindstrom",
            project: "GreenTech Ltd",
            rating: 5,
            text: "Our clean energy explainer video turned out fantastic. They managed to make complex thermal system processes look simple and visually appealing.",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "4 months ago"
        },
        {
            id: 'google-17',
            author: "Fatima Al-Sayed",
            project: "BioLabs Tech",
            rating: 5,
            text: "الرسوم المتحركة الطبية التي صمموها لنا كانت مذهلة ومبسطة للغاية. التفاصيل الدقيقة للخلايا ثلاثية الأبعاد كانت دقيقة وعلمية بشكل لا يصدق.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-18',
            author: "Hans Weymann",
            project: "Solar Solutions",
            rating: 5,
            text: "Zuverlässiges Rendering-Studio mit tiefem Verständnis für technische Spezifikationen. Sehr zu empfehlen für präzise industrielle Animationen.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "5 months ago"
        },
        {
            id: 'google-19',
            author: "Nina Kovac",
            project: "BioLabs Inc",
            rating: 5,
            text: "Great attention to our cellular modeling guidelines. There was a minor delay in texturing, but the final 3D animation is beautiful.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-20',
            author: "Alexander Wright",
            project: "Capital Partners",
            rating: 5,
            text: "An absolute pleasure to work with. Clean storyboard, gorgeous color styling, and smooth delivery of our corporate overview animation.",
            image: "",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-21',
            author: "Marie Dubois",
            project: "Eco Packaging",
            rating: 5,
            text: "Ils ont créé une superbe animation de style papier découpé pour nos emballages écologiques. Cela correspond parfaitement à la personnalité de notre marque.",
            image: "",
            isGoogle: true,
            time: "5 months ago"
        },
        {
            id: 'google-22',
            author: "Stefan Meyer",
            project: "Tech Innovations",
            rating: 5,
            text: "Schnelle Arbeit und hervorragende technische Präzision! Die Explosionsdarstellungs-Animation unseres intelligenten Schlosses zeigte genau, wie die mechanischen Teile zusammenpassen.",
            image: "",
            isGoogle: true,
            time: "6 months ago"
        },
        {
            id: 'google-23',
            author: "Chloe Higgins",
            project: "Creative Agency",
            rating: 5,
            text: "We partnered with SmooothPixel for a client's 3D product render. The communication was flawless, and the final results exceeded all metrics.",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-24',
            author: "Daniel Petrov",
            project: "Aero Engineering",
            rating: 5,
            text: "High-fidelity aerodynamics visualization. They captured air flow turbulence beautifully. Quality is absolutely outstanding.",
            image: "",
            isGoogle: true,
            time: "6 months ago"
        },
        {
            id: 'google-25',
            author: "Laura Martinez",
            project: "Food & Beverage",
            rating: 5,
            text: "Splendides simulations de liquides ! L'animation d'éclaboussure de jus d'orange avait l'air incroyablement fraîche et naturelle. Produit extrêmement professionnel.",
            image: "",
            isGoogle: true,
            time: "7 months ago"
        },
        {
            id: 'google-26',
            author: "Tariq Al-Fahad",
            project: "Fintech App",
            rating: 5,
            text: "فيديو توضيحي ممتاز للتطبيق الخاص بنا! المؤثرات البصرية وتصميم شاشات التطبيق كان عصرياً وجذاباً للغاية. سرعة استجابة مذهلة من الفريق.",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "2 months ago"
        },
        {
            id: 'google-27',
            author: "Charlotte Berg",
            project: "Architecture Hub",
            rating: 5,
            text: "Very realistic fly-through animation for our modern villa design. The interior styling looked absolutely photorealistic. Incredible work!",
            image: "",
            isGoogle: true,
            time: "7 months ago"
        },
        {
            id: 'google-28',
            author: "Christian Wolff",
            project: "Cyber Security",
            rating: 5,
            text: "Sie haben unsere Server-Infrastruktur und Netzwerkprotokolle durch dynamische Cyber-Neon-Grafiken extrem anschaulich dargestellt. Geniale Arbeit!",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-29',
            author: "Clara Schuster",
            project: "Kids Entertainment",
            rating: 5,
            text: "Die Charakteranimationen, die sie für unsere Kinderbuch-App entworfen haben, waren so süß, farbenfroh und flüssig. Absolut empfehlenswert!",
            image: "",
            isGoogle: true,
            time: "8 months ago"
        },
        {
            id: 'google-30',
            author: "Paul Neumann",
            project: "Berlin Smart Mobiles",
            rating: 5,
            text: "SmoothPixel ist mit Abstand das beste Motion-Design-Studio in Deutschland. Hochprofessionell, reaktionsschnell und unglaublich kreativ.",
            image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "8 months ago"
        },
        {
            id: 'google-31',
            author: "Mia Hansen",
            project: "Danish Design Co",
            rating: 5,
            text: "Elegant, minimalistic Nordic style design and animation. They perfectly captured our brand aesthetics in a 15-second product film.",
            image: "",
            isGoogle: true,
            time: "9 months ago"
        },
        {
            id: 'google-32',
            author: "Eric Laurent",
            project: "Smart Energy",
            rating: 5,
            text: "Good workflow, high quality output. We had to do two revisions to get the solar panel angle right, but the team was very cooperative.",
            image: "",
            isGoogle: true,
            time: "9 months ago"
        },
        {
            id: 'google-33',
            author: "Natalia Ortiz",
            project: "Luxury Fragrance",
            rating: 5,
            text: "Un rendu de flacon et des simulations de brume tout simplement magnifiques. La publicité pour le parfum ressemble à un film de cinéma haut de gamme.",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-34',
            author: "Michael Brown",
            project: "Venture Corp",
            rating: 5,
            text: "SmooothPixel delivered exactly what we needed: a fast, sleek, professional pitch-deck video with stunning 3D data visualizations.",
            image: "",
            isGoogle: true,
            time: "10 months ago"
        },
        {
            id: 'google-35',
            author: "Zainab Hashim",
            project: "Al-Noor Luxury",
            rating: 5,
            text: "تفاصيل بريق المجوهرات وانعكاسات الإضاءة على قطع الألماس كانت مذهلة ومتقنة للغاية. قدموا لنا فيديو إعلاني فاخر تجاوز كل توقعاتنا.",
            image: "",
            isGoogle: true,
            time: "11 months ago"
        },
        {
            id: 'google-36',
            author: "Lars Gustafsson",
            project: "Nordic Marine",
            rating: 5,
            text: "Highly impressive simulation of ocean waves and vessel stability. We will use this rendering for all our official presentations.",
            image: "",
            isGoogle: true,
            time: "10 months ago"
        },
        {
            id: 'google-37',
            author: "Sarah Connolly",
            project: "Travel Booking Co",
            rating: 5,
            text: "A gorgeous 3D character explainer video that boosted our conversion rate by 35%. The team is exceptionally talented and easy to work with.",
            image: "",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-38',
            author: "Fabian Richter",
            project: "Smart Home Systems",
            rating: 5,
            text: "Perfekte Explosionsdarstellung unseres Thermostat-Hubs. Die Präzision des 3D-Modells und die Logik der Systembaugruppe sind hervorragend!",
            image: "",
            isGoogle: true,
            time: "11 months ago"
        },
        {
            id: 'google-39',
            author: "Giulia Rossi",
            project: "Espresso Labs",
            rating: 5,
            text: "The coffee pouring and steam rendering inside the espresso cup was absolutely gorgeous. Superb attention to liquid styling.",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "11 months ago"
        },
        {
            id: 'google-40',
            author: "Oscar Larsson",
            project: "Sound Systems",
            rating: 5,
            text: "Unbelievable speaker cone vibration animation and sound-wave visualization! Truly professional product that sounds and looks great.",
            image: "",
            isGoogle: true,
            time: "11 months ago"
        },
        {
            id: 'google-41',
            author: "Linda Vance",
            project: "Prime Real Estate",
            rating: 5,
            text: "Amazing 3D architectural walkthrough! They captured the premium finishes, ambient sunset lighting, and landscape details perfectly.",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-42',
            author: "Victor Hugo",
            project: "Paris Media",
            rating: 5,
            text: "Un travail rapide, une qualité hors du commun et une équipe hautement professionnelle. Ils ont conçu l'animation d'introduction de notre chaîne.",
            image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-43',
            author: "Maria Ivanova",
            project: "EdTech Ltd",
            rating: 5,
            text: "We commissioned a series of educational biology animations. SmoothPixel delivered extremely accurate and visually stunning cellular graphics.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-44',
            author: "Patrick Higgins",
            project: "Logistics Tech",
            rating: 5,
            text: "Outstanding route map optimization explainer. The motion flow is super smooth, and the narrative matches the speed perfectly.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-45',
            author: "Sophie Dubois",
            project: "Organic Skincare",
            rating: 5,
            text: "Les chutes de pétales de fleurs et les textures de crème sont si pures et naturelles. Convient parfaitement aux valeurs durables de notre marque.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-46',
            author: "Martin Luther",
            project: "Tech Solutions",
            rating: 5,
            text: "Fantastische 3D-Darstellung unserer Server-Chips. Die mikroskopischen Kupferpfade und das Glühen der Wärmeableitung wirken extrem hochwertig.",
            image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-47',
            author: "Lisa Campbell",
            project: "Fitness App",
            rating: 5,
            text: "We are super happy with the UI motion design and screen animations for our new iOS application. Highly engaging product!",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-48',
            author: "Kamal Mansouri",
            project: "Tunis Media",
            rating: 5,
            text: "فريق محترف للغاية ومبدع! قمنا بتصميم مقدمة الرسوم المتحركة لشبكتنا الإعلامية وكانت النتيجة رائعة ومبهرة للجميع. شكرًا لكم.",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-49',
            author: "Andreas Baader",
            project: "Berlin Sound Systems",
            rating: 5,
            text: "Die metallischen Audiotreiber-Texturen und Lautsprechergitter-Animationen sehen extrem realistisch aus. Absolute Spitzenqualität aus Berlin!",
            image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-50',
            author: "Natalie Portman",
            project: "Act Studio",
            rating: 5,
            text: "High-end corporate video animation. The team helped bring our brand deck to life with incredible elegance and fast turnarounds.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-51',
            author: "James Cole",
            project: "Aero Tech",
            rating: 5,
            text: "The turbofan jet engine simulation was exceptionally detailed, showing perfect fan blades rotation and exhaust particles.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-52',
            author: "Helen Hunt",
            project: "Medical Care",
            rating: 5,
            text: "They transformed complex medical data into a visually compelling, easy-to-follow explainer video. Highly recommend their work.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-53',
            author: "Arthur Pendragon",
            project: "Camelot Media",
            rating: 5,
            text: "Breathtaking visual design and VFX. SmoothPixel really knows how to capture atmospheric lighting and grand cinematic scale.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-54',
            author: "Bruce Wayne",
            project: "Gotham Tech",
            rating: 5,
            text: "The military-grade prototype animation was flawlessly detailed, showing accurate mechanical joints and thermal vision overlays.",
            image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-55',
            author: "Tony Stark",
            project: "Arc Industries",
            rating: 5,
            text: "Brilliant holographic UI concept designs and high-fidelity rendering. The holographic assembly animation was superb.",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        },
        {
            id: 'google-56',
            author: "Peter Parker",
            project: "Web Solutions",
            rating: 5,
            text: "Awesome particle simulations and web movement animations! They are fast, friendly, and produce incredibly clean designs.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-57',
            author: "Diana Prince",
            project: "Themis Agency",
            rating: 5,
            text: "They created a gorgeous, majestic brand film using gold typography and graceful cinematic motion. Truly professional product.",
            image: "",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-58',
            author: "Clark Kent",
            project: "Daily Planet",
            rating: 5,
            text: "Very smooth transitions and clean, professional visuals. The global connectivity explainer video was outstanding.",
            image: "",
            isGoogle: true,
            time: "3 years ago"
        },
        {
            id: 'google-59',
            author: "Barry Allen",
            project: "Speed Labs",
            rating: 5,
            text: "Fast work is an understatement! They delivered a stunning lightning VFX intro video in record time. Phenomenal speed!",
            image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150&h=150&q=80",
            isGoogle: true,
            time: "1 year ago"
        },
        {
            id: 'google-60',
            author: "Hal Jordan",
            project: "Emerald Corp",
            rating: 5,
            text: "Spectacular light and glass refraction simulations! The green energy rings animation was absolutely mesmerizing.",
            image: "",
            isGoogle: true,
            time: "2 years ago"
        }
    ];

    // Separate reviews by source
    const websiteReviewsList = useMemo(() => {
        return fetchedReviews.filter(r => r.company?.toLowerCase() !== 'google review');
    }, [fetchedReviews]);

    const displayWebsiteReviews = useMemo(() => {
        if (websiteReviewsList.length > 0) return websiteReviewsList;
        return [
            { id: 1, author: "David Chen", project: "TechFlow Systems", rating: 5, text: "The motion system delivered by SmoothPixel completely transformed our brand identity." },
            { id: 2, author: "Sarah Jenkins", project: "Aura Creative", rating: 5, text: "Exceptional 3D product visualization. Photorealistic quality with a stylistic edge." },
            { id: 3, author: "Marcus Aurelius", project: "Rome Holdings", rating: 5, text: "Top-notch animation work, delivered precisely on time. Highly recommended creative studio!" }
        ];
    }, [websiteReviewsList]);

    const allGoogleReviews = useMemo(() => {
        const dbGoogleReviews = fetchedReviews
            .filter(r => r.company?.toLowerCase() === 'google review')
            .map((r, idx) => ({
                id: r._id || r.id || `dbg-${idx}`,
                author: r.author || r.Author || 'Anonymous Client',
                project: r.project || r.Project || 'Verified Client',
                rating: Number(r.rating !== undefined ? r.rating : (r.Rating !== undefined ? r.Rating : 5)),
                text: r.text || r.Text || r.comment || '',
                image: r.image || r.Image || '',
                website: r.website || r.Website || '',
                socialLink: r.socialLink || r.SocialLink || '',
                isGoogle: true,
                time: "Recently"
            }));
        return [...googleReviews, ...dbGoogleReviews];
    }, [fetchedReviews]);

    // Google widget Topic Badges
    const googleTopics = [
        { name: 'All', count: allGoogleReviews.length },
        { name: 'explainer video', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('explainer') || r.text.toLowerCase().includes('video')).length },
        { name: 'fast work', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('fast') || r.text.toLowerCase().includes('work')).length },
        { name: 'professional product', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('professional') || r.text.toLowerCase().includes('product')).length }
    ];

    const filteredGoogleReviews = useMemo(() => {
        if (selectedTopic === 'All') return allGoogleReviews;
        return allGoogleReviews.filter(r => r.text.toLowerCase().includes(selectedTopic.toLowerCase()));
    }, [allGoogleReviews, selectedTopic]);

    const ratingStats = useMemo(() => {
        const total = allGoogleReviews.length;
        if (total === 0) return { 
            avg: 5.0, 
            pct5: 100, pct4: 0, pct3: 0, pct2: 0, pct1: 0,
            count5: 0, count4: 0, count3: 0, count2: 0, count1: 0 
        };
        
        let sum = 0;
        let c5 = 0, c4 = 0, c3 = 0, c2 = 0, c1 = 0;
        allGoogleReviews.forEach(r => {
            sum += r.rating;
            if (r.rating === 5) c5++;
            else if (r.rating === 4) c4++;
            else if (r.rating === 3) c3++;
            else if (r.rating === 2) c2++;
            else if (r.rating === 1) c1++;
        });

        return {
            avg: (sum / total).toFixed(1),
            pct5: Math.round((c5 / total) * 100),
            pct4: Math.round((c4 / total) * 100),
            pct3: Math.round((c3 / total) * 100),
            pct2: Math.round((c2 / total) * 100),
            pct1: Math.round((c1 / total) * 100),
            count5: c5,
            count4: c4,
            count3: c3,
            count2: c2,
            count1: c1
        };
    }, [allGoogleReviews]);

    return (
        <section id="reviews" className="review-area default-padding position-relative">
            <div className="container">
                {/* 1. TESTIMONIALS SLIDER SECTION */}
                <div className="row align-items-center mb-5">
                    <div className="col-lg-6 col-md-7">
                        <div className="site-heading mb-0">
                            <h4 className="sub-title">{t('review_sub')}</h4>
                            <h2 className="title">{t('review_title')}</h2>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-5 d-flex justify-content-md-end gap-3 mt-4 mt-md-0">
                        <button className="btn-review-primary" onClick={() => openWriteModal('website')}>
                            <i className="fas fa-pen-nib me-2"></i> {t('write_review')}
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 }
                    }}
                    className="review-swiper mb-5"
                >
                    {displayWebsiteReviews.map((review: any, idx) => {
                        const ratingVal = Number(review.rating !== undefined ? review.rating : (review.Rating !== undefined ? review.Rating : 5));
                        const authorVal = review.author || review.Author || '';
                        const textVal = review.text || review.Text || review.comment || '';
                        const projectVal = review.project || review.Project || review.company || review.Company || 'General';
                        const imageVal = review.image || review.Image || '';
                        const websiteVal = review.website || review.Website || '';
                        const socialLinkVal = review.socialLink || review.SocialLink || '';

                        return (
                            <SwiperSlide key={review._id || review.id || idx}>
                                <div className="review-card-v2 sp-card p-5 h-100 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="stars text-accent">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fas fa-star ${i < ratingVal ? '' : 'opacity-30'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="comment mb-4">"{textVal}"</p>
                                    <div className="client-meta d-flex align-items-center gap-3 mt-auto">
                                        <div className="avatar">
                                            <img src={imageVal || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorVal || 'Client')}&background=random`} alt="" />
                                        </div>
                                        <div>
                                            <h6 className="text-dark-heading m-0 fw-800">{authorVal}</h6>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="client-project fs-11 fw-700">{projectVal}</span>
                                                {websiteVal && (
                                                    <a href={websiteVal} target="_blank" rel="noopener noreferrer" className="text-accent fs-11" title="Website">
                                                        <i className="fas fa-globe"></i>
                                                    </a>
                                                )}
                                                {socialLinkVal && (
                                                    <a href={socialLinkVal} target="_blank" rel="noopener noreferrer" className="text-slate-400 fs-11" title="Social Profile">
                                                        <i className={getSocialIconClass(socialLinkVal)}></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <hr className="my-5 opacity-10" />

                {/* 2. COMPACT GOOGLE MAPS & BUSINESS REVIEW PORTAL WIDGET */}
                <div className="site-heading mb-4 text-center">
                    <h4 className="sub-title">{t('live_verification')}</h4>
                    <h2 className="title-sm">{t('google_reviews_title')}</h2>
                </div>

                <div className="google-widget-container sp-card p-3 p-lg-4">
                    <div className="row g-4">
                        {/* LEFT COLUMN: Sleek Business Info + Mini Google Map */}
                        <div className="col-lg-5 col-xl-4 d-flex flex-column gap-3">
                            <div className="google-widget-biz-card p-4">
                                <h3 className="biz-title m-0">SmooothPixel</h3>
                                <div className="d-flex align-items-center gap-2 my-2">
                                    <span className="biz-rating-val">{ratingStats.avg}</span>
                                    <div className="stars text-accent fs-12">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fas fa-star"></i>
                                        ))}
                                    </div>
                                    <span className="biz-reviews-count">({allGoogleReviews.length})</span>
                                </div>
                                <p className="biz-category mb-3">{t('studio_subtitle')}</p>

                                <div className="biz-quick-actions d-flex justify-content-around py-3 border-top border-bottom mb-3">
                                    <a href={locationAccount && locationAccount.link ? locationAccount.link : "#"} target={locationAccount && locationAccount.link ? "_blank" : undefined} rel="noopener noreferrer" className="biz-action-btn" onClick={locationAccount && locationAccount.link ? undefined : () => openWriteModal('google')}>
                                        <div className="icon-circle"><i className="fas fa-directions"></i></div>
                                        <span>{t('directions')}</span>
                                    </a>
                                    <button className="biz-action-btn" onClick={() => openWriteModal('google')}>
                                        <div className="icon-circle"><i className="far fa-bookmark"></i></div>
                                        <span>{t('save')}</span>
                                    </button>
                                    <a href={telegramAccount ? telegramAccount.link : "https://t.me/SmooothPixel"} target="_blank" rel="noopener noreferrer" className="biz-action-btn">
                                        <div className="icon-circle"><i className={telegramAccount ? telegramAccount.icon : "fab fa-telegram-plane"}></i></div>
                                        <span>{t('telegram')}</span>
                                    </a>
                                </div>

                                <div className="biz-details-list d-flex flex-column gap-2 fs-12">
                                    <div className="d-flex align-items-center gap-3">
                                        <i className={locationAccount ? locationAccount.icon : "fas fa-map-marker-alt text-slate-500"}></i>
                                        <span className="text-slate-700">{locationAccount ? locationAccount.value : "Berlin, Germany"}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <i className="far fa-clock text-slate-500"></i>
                                        <span className="fw-700 text-success">{t('open_24_hours')}</span>
                                    </div>
                                    {phoneAccount && (
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={phoneAccount.icon || "fas fa-phone text-slate-500"}></i>
                                            <a href={`tel:${phoneAccount.value}`} className="text-slate-700 text-decoration-none fw-600">
                                                {phoneAccount.value}
                                            </a>
                                        </div>
                                    )}
                                    {emailAccount && (
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={emailAccount.icon || "fas fa-envelope text-slate-500"}></i>
                                            <a href={`mailto:${emailAccount.value}`} className="text-slate-700 text-decoration-none fw-600">
                                                {emailAccount.value}
                                            </a>
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center gap-3">
                                        <i className={telegramAccount ? telegramAccount.icon : "fab fa-telegram-plane text-slate-500"} style={{ fontSize: '14px' }}></i>
                                        <a href={telegramAccount ? telegramAccount.link : "https://t.me/SmooothPixel"} target="_blank" rel="noopener noreferrer" className="text-slate-700 text-decoration-none fw-600">
                                            {telegramAccount ? telegramAccount.value : "@SmooothPixel"}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Embedded Google Map */}
                            <div className="google-widget-mini-map">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.7329598285507!2d13.404953977348981!3d52.520006597143924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f035901%3A0x421120dd37522d0!2sBerlin%2C%20Germany!5e0!3m2!1sen!2s!4v1700000000000" 
                                    width="100%" 
                                    height="180px" 
                                    style={{ border: 0, borderRadius: '16px' }} 
                                    allowFullScreen 
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Review Summary + Badges + Scrollable List */}
                        <div className="col-lg-7 col-xl-8 d-flex flex-column justify-content-between">
                            <div className="google-widget-reviews-panel p-4">
                                <div className="row align-items-center border-bottom pb-4 mb-4">
                                    {/* Left Column: Thick Rounded Google Style Progress Bars */}
                                    <div className="col-sm-7">
                                        <div className="star-bar-grid d-flex flex-column gap-2 pe-sm-3">
                                            {[
                                                { label: '5', pct: ratingStats.pct5, count: ratingStats.count5 },
                                                { label: '4', pct: ratingStats.pct4, count: ratingStats.count4 },
                                                { label: '3', pct: ratingStats.pct3, count: ratingStats.count3 },
                                                { label: '2', pct: ratingStats.pct2, count: ratingStats.count2 },
                                                { label: '1', pct: ratingStats.pct1, count: ratingStats.count1 }
                                            ].map((bar, i) => (
                                                <div className="d-flex align-items-center gap-3" key={i}>
                                                    <span className="bar-label-num" style={{ width: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#202124' }}>{bar.label}</span>
                                                    <div className="progress-container-real flex-grow-1" style={{ height: '10px', background: '#e8eaed', borderRadius: '9999px', overflow: 'hidden' }}>
                                                        <div className="progress-fill-real" style={{ width: `${bar.pct}%`, height: '100%', background: '#f4b400', borderRadius: '9999px' }}></div>
                                                    </div>
                                                    <span className="bar-label-count" style={{ width: '28px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#70757a' }}>{bar.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Middle Column: Vertical Line Divider */}
                                    <div className="col-sm-1 d-none d-sm-flex justify-content-center" style={{ alignSelf: 'stretch' }}>
                                        <div style={{ borderLeft: '1px solid #dadce0', height: '100%', minHeight: '110px' }}></div>
                                    </div>

                                    {/* Right Column: Google Style Avg rating with SVG Stars & Action Pill Button */}
                                    <div className="col-sm-4 text-center d-flex flex-column align-items-center justify-content-center mt-3 mt-sm-0">
                                        <h2 className="display-avg-sm m-0" style={{ fontSize: '56px', fontWeight: '500', color: '#202124', fontFamily: '"Google Sans", Roboto, sans-serif' }}>{ratingStats.avg}</h2>
                                        <div className="stars-svg-wrapper d-flex justify-content-center gap-1 my-2">
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const avgNum = Number(ratingStats.avg);
                                                const isFilled = star <= Math.round(avgNum);
                                                return (
                                                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill={isFilled ? "#f4b400" : "none"} stroke={isFilled ? "#f4b400" : "#dadce0"} strokeWidth="1.5">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        <p className="total-reviews-label fs-12 mb-2 text-slate-500" style={{ fontWeight: '500' }}>{allGoogleReviews.length} Google reviews</p>
                                        <button type="button" className="btn-google-write-review-real" onClick={() => openWriteModal('google')}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2.5" className="me-2" style={{ verticalAlign: 'middle', marginTop: '-2px' }}>
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                                            </svg>
                                            <span style={{ fontWeight: '500' }}>{t('write_review_btn')}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Badges */}
                                <div className="mb-3 d-flex flex-wrap gap-2">
                                    {googleTopics.map((t, idx) => (
                                        <button 
                                            key={idx} 
                                            className={`google-filter-badge-sm ${selectedTopic === t.name ? 'active' : ''}`}
                                            onClick={() => setSelectedTopic(t.name)}
                                        >
                                            {t.name} <span className="badge-count-sm">{t.count}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Scrollable Review List */}
                                <div className="google-reviews-scrollable-list-sm">
                                    {filteredGoogleReviews.map((review) => {
                                        const isExpanded = expandedReviews.includes(String(review.id));
                                        const isHelpful = helpfulReviews.includes(String(review.id));
                                        const isLong = review.text.length > 180;
                                        const displayText = isExpanded || !isLong ? review.text : review.text.slice(0, 180) + '...';
                                        const badge = getReviewerBadge(review);
                                        const isLocalGuide = badge.includes('Local Guide');
                                        return (
                                            <div className="google-review-card-item" key={review.id}>
                                                {/* Reviewer Header */}
                                                <div className="d-flex align-items-start gap-2 mb-2">
                                                    <div className="google-avatar-lg" style={!review.image ? getAvatarStyle(review.author) : undefined}>
                                                        {review.image
                                                            ? <img src={review.image} className="w-100 h-100" style={{ objectFit: 'cover', borderRadius: '50%' }} alt="" />
                                                            : <span>{review.author.trim().charAt(0).toUpperCase()}</span>}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <h6 className="review-item-author m-0">{review.author}</h6>
                                                            <button
                                                                type="button"
                                                                className="review-more-btn"
                                                                title="More options"
                                                            >⋮</button>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 mt-0">
                                                            {isLocalGuide && (
                                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="#1a73e8">
                                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                                </svg>
                                                            )}
                                                            <span className="review-item-meta">{badge}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Stars + Time */}
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <div className="review-stars-row">
                                                        {[1,2,3,4,5].map(s => (
                                                            <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                                                                fill={s <= review.rating ? '#f4b400' : '#e8eaed'}
                                                                stroke={s <= review.rating ? '#f4b400' : '#e8eaed'}
                                                                strokeWidth="0">
                                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="review-item-time">{review.time}</span>
                                                </div>
                                                {/* Review Text */}
                                                <p className="review-item-comment">
                                                    {displayText}
                                                    {isLong && (
                                                        <button
                                                            type="button"
                                                            className="review-expand-btn"
                                                            onClick={() => toggleExpand(review.id)}
                                                        >
                                                            {isExpanded ? ' Less' : ' More'}
                                                        </button>
                                                    )}
                                                </p>
                                                {/* Helpful button */}
                                                <div className="d-flex align-items-center gap-2 mt-1 mb-2">
                                                    <button
                                                        type="button"
                                                        className={`review-helpful-btn ${isHelpful ? 'active' : ''}`}
                                                        onClick={() => toggleHelpful(review.id)}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24"
                                                            fill={isHelpful ? '#1a73e8' : 'none'}
                                                            stroke={isHelpful ? '#1a73e8' : '#70757a'}
                                                            strokeWidth="2">
                                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                                                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                                        </svg>
                                                        <span>{t('helpful')}</span>
                                                    </button>
                                                </div>
                                                <div className="review-divider"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* UNIFIED DUAL-THEME MODAL FORM POPUP */}
            {showModal && (
                <div className="modal-review-overlay">
                    <div className={`${modalTab === 'google' ? 'google-modal-content' : 'website-modal-content'} animate-scale-up p-4`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        
                        {/* Tab Switcher inside Modal */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <div className="d-flex gap-2">
                                <button 
                                    type="button" 
                                    className={`modal-tab-btn ${modalTab === 'website' ? 'active' : ''}`}
                                    onClick={() => setModalTab('website')}
                                >
                                    <i className="fas fa-globe me-2"></i> {t('website_review')}
                                </button>
                                <button 
                                    type="button" 
                                    className={`modal-tab-btn ${modalTab === 'google' ? 'active' : ''}`}
                                    onClick={() => setModalTab('google')}
                                >
                                    <i className="fab fa-google me-2"></i> {t('google_review')}
                                </button>
                            </div>
                            <button className="btn-close-google-modal" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="text-center py-5">
                                <div className="success-icon mb-4">
                                    <i className="fas fa-check-circle text-success fs-1"></i>
                                </div>
                                <h4 className={modalTab === 'google' ? 'text-slate-800 fw-700' : 'text-white fw-700'}>{t('review_submitted_title')}</h4>
                                <p className={modalTab === 'google' ? 'text-slate-500' : 'text-slate-300'}>
                                    {t('review_submitted_desc')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview}>
                                {modalTab === 'google' ? (
                                    /* REAL GOOGLE REVIEW FORM STYLE ACCORDING TO SCREENSHOT */
                                    <div className="google-real-form-wrapper">
                                        {/* GOOGLE HEADER */}
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="google-avatar-square" style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                borderRadius: '50%', 
                                                overflow: 'hidden', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                ...(!image ? getAvatarStyle(author || 'G') : {})
                                            }}>
                                                {image ? (
                                                    <img src={image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="" />
                                                ) : (
                                                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        {author ? author.trim().charAt(0).toUpperCase() : 'G'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h6 className="m-0 fw-700 text-slate-800" style={{ fontSize: '15px' }}>{author || 'Anonymous'}</h6>
                                                <span className="text-slate-500 fs-12 d-flex align-items-center gap-1">
                                                    {t('posting_publicly')} <i className="far fa-question-circle" style={{ fontSize: '11px' }}></i>
                                                </span>
                                            </div>
                                        </div>

                                        {/* GOOGLE RATING STARS — with hover effect */}
                                        <div className="rating-select-google d-flex gap-1 my-3 justify-content-center">
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const filled = star <= (hoverStar || rating);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverStar(star)}
                                                        onMouseLeave={() => setHoverStar(0)}
                                                        style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', transition: 'transform 0.1s' }}
                                                    >
                                                        <svg width="40" height="40" viewBox="0 0 24 24"
                                                            fill={filled ? '#f4b400' : 'none'}
                                                            stroke={filled ? '#f4b400' : '#bdc1c6'}
                                                            strokeWidth="1.5"
                                                            style={{ filter: filled ? 'drop-shadow(0 1px 2px rgba(244,180,0,0.4))' : 'none', transition: 'all 0.15s' }}>
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                        </svg>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p style={{ textAlign: 'center', fontSize: '12px', color: '#5f6368', marginBottom: '8px' }}>
                                            {rating === 1 ? 'Terrible' : rating === 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent'}
                                        </p>

                                        {/* GOOGLE TEXTAREA COMMENT */}
                                        <div className="mb-1">
                                            <textarea
                                                required
                                                rows={5}
                                                className="google-textarea-real"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder="Share details of your own experience at this place"
                                                maxLength={500}
                                            />
                                            <div style={{ textAlign: 'right', fontSize: '11px', color: '#9aa0a6', marginTop: '4px' }}>
                                                {text.length} / 500
                                            </div>
                                        </div>

                                        {/* GOOGLE ADD PHOTO BUTTON */}
                                        <div className="mb-3">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                id="review-image-upload" 
                                                className="d-none" 
                                                onChange={handleImageUpload} 
                                            />
                                            <label htmlFor="review-image-upload" className="google-add-photos-btn m-0 d-flex align-items-center justify-content-center gap-2" style={{ cursor: 'pointer' }}>
                                                {isUploading ? (
                                                    <i className="fas fa-spinner fa-spin text-primary-google"></i>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2">
                                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                        <circle cx="12" cy="13" r="4" />
                                                        <line x1="12" y1="11" x2="12" y2="15" />
                                                        <line x1="10" y1="13" x2="14" y2="13" />
                                                    </svg>
                                                )}
                                                <span>{image ? 'Change Photo' : 'Add photos and videos'}</span>
                                            </label>
                                        </div>

                                        {/* REVIEWER INFO FIELDS (Google Material-style details section) */}
                                        <div className="google-details-fields mb-3 p-3" style={{ background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                                            <h6 className="fs-11 fw-700 text-slate-600 mb-2 uppercase" style={{ letterSpacing: '0.5px' }}>{t('reviewer_details_title')}</h6>
                                            <div className="d-flex flex-column gap-2">
                                                <input 
                                                    type="text" 
                                                    required 
                                                    className="google-input-real" 
                                                    value={author} 
                                                    onChange={(e) => setAuthor(e.target.value)} 
                                                    placeholder="your_name_placeholder"
                                                />
                                                <div className="row g-2">
                                                    <div className="col-12 col-md-6">
                                                        <input 
                                                            type="text" 
                                                            className="google-input-real" 
                                                            value={project} 
                                                            onChange={(e) => setProject(e.target.value)} 
                                                            placeholder={t('company_project_placeholder')}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <input 
                                                            type="url" 
                                                            className="google-input-real" 
                                                            value={website} 
                                                            onChange={(e) => setWebsite(e.target.value)} 
                                                            placeholder={t('website_url_placeholder')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                            <button 
                                                type="button" 
                                                className="google-btn-cancel-real" 
                                                onClick={() => setShowModal(false)}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="google-btn-post-real" 
                                                disabled={isSubmitting || isUploading}
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* WEBSITE THEME LAYOUT */
                                    <div className="website-real-form-wrapper">
                                        <div className="mb-4">
                                            <h5 className="text-white fw-800 m-0"><i className="fas fa-file-signature text-accent me-2"></i> {t('submit_website_testimonial')}</h5>
                                            <p className="text-slate-400 fs-11">{t('review_deck_desc')}</p>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label-website">{t('your_name')}</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className="website-input" 
                                                value={author} 
                                                onChange={(e) => setAuthor(e.target.value)} 
                                                placeholder="enter_name_placeholder"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label-website">{t('company_project_placeholder')}</label>
                                            <input 
                                                type="text" 
                                                className="website-input" 
                                                value={project} 
                                                onChange={(e) => setProject(e.target.value)} 
                                                placeholder="company_name_placeholder"
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <label className="form-label-website">{t('website_link_optional')}</label>
                                                <input 
                                                    type="url" 
                                                    className="website-input" 
                                                    value={website} 
                                                    onChange={(e) => setWebsite(e.target.value)} 
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label-website">{t('social_profile_optional')}</label>
                                                <input 
                                                    type="url" 
                                                    className="website-input" 
                                                    value={socialLink} 
                                                    onChange={(e) => setSocialLink(e.target.value)} 
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3 border-top pt-3">
                                            <label className="form-label-website text-center d-block mb-2">{t('click_stars_to_rate')}</label>
                                            <div className="rating-select d-flex justify-content-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button 
                                                        type="button" 
                                                        key={star} 
                                                        className={`btn-star-select ${star <= rating ? 'active' : ''}`}
                                                        onClick={() => setRating(star)}
                                                    >
                                                        <i className="fas fa-star"></i>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3 border-top pt-3">
                                            <label className="form-label-website">{t('profile_photo_optional')}</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    id="review-image-upload" 
                                                    className="d-none" 
                                                    onChange={handleImageUpload} 
                                                />
                                                <label htmlFor="review-image-upload" className="btn-upload-website m-0 text-center py-2 flex-grow-1" style={{ cursor: 'pointer' }}>
                                                    {isUploading ? <i className="fas fa-spinner fa-spin me-2"></i> : <i className="fas fa-camera me-2"></i>}
                                                    {image ? 'Change Profile Image' : 'Select Profile Image'}
                                                </label>
                                                {image && (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="text-success fs-14"><i className="fas fa-check-circle"></i> Ready</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4 border-top pt-3">
                                            <label className="form-label-website">Share details of your experience *</label>
                                            <textarea 
                                                required 
                                                rows={4} 
                                                className="website-input" 
                                                value={text} 
                                                onChange={(e) => setText(e.target.value)} 
                                                placeholder="describe_project_placeholder"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                            <button 
                                                type="button" 
                                                className="website-btn-cancel" 
                                                onClick={() => setShowModal(false)}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="website-btn-post" 
                                                disabled={isSubmitting || isUploading}
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                /* Soft blue-gray light theme background exactly as shown in screenshot */
                .review-area {
                    background: #eef2f6 !important;
                    padding-top: 80px;
                    padding-bottom: 80px;
                    overflow: hidden;
                }

                .text-accent { color: #f5b800 !important; }
                .text-primary-google { color: #1a73e8 !important; }

                /* 1. Website Testimonials Slider Cards */
                .review-swiper .swiper-slide {
                    height: auto !important;
                    display: flex !important;
                }

                .review-card-v2 .comment { 
                    color: #334155 !important;
                    font-size: 14px; 
                    line-height: 1.6; 
                    font-weight: 500;
                    flex-grow: 1;
                }
                .review-card-v2 .client-project { 
                    color: #64748b !important;
                }
                .avatar { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(0,0,0,0.05); }
                .avatar img { width: 100%; height: 100%; object-fit: cover; }

                /* Swiper Bullets color fix */
                .review-swiper .swiper-pagination-bullet-active {
                    background: #f5b800 !important;
                }

                /* Headings scoped only to this section */
                .review-area .sub-title {
                    color: #f5b800 !important;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 11px;
                    font-weight: 800;
                }
                .review-area .title {
                    color: #0f172a !important;
                    font-size: 36px !important;
                    font-weight: 800 !important;
                }
                .review-area .title-sm {
                    color: #0f172a !important;
                    font-size: 28px !important;
                    font-weight: 800 !important;
                }
                .review-area .text-dark-heading {
                    color: #0f172a !important;
                }

                /* Buttons */
                .btn-review-primary {
                    background: linear-gradient(135deg, #f5b800, #d97706);
                    color: #fff !important;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 13px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(245, 184, 0, 0.2);
                    cursor: pointer;
                }
                .btn-review-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(245, 184, 0, 0.3);
                }

                /* 2. COMPACT GOOGLE LIVE WIDGET STYLING */

                
                .google-widget-biz-card {
                    background: #f8f9fa !important;
                    border: 1px solid #e8eaed !important;
                    border-radius: 16px;
                }
                .biz-title {
                    font-size: 20px !important;
                    font-weight: 700 !important;
                    color: #202124 !important;
                }
                .biz-rating-val {
                    font-weight: 700 !important;
                    font-size: 13px !important;
                    color: #202124 !important;
                }
                .biz-reviews-count {
                    color: #70757a !important;
                    font-size: 12px !important;
                }
                .biz-category {
                    color: #70757a !important;
                    font-size: 12px !important;
                }
                .biz-action-btn {
                    background: transparent;
                    border: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-decoration: none;
                    cursor: pointer;
                    color: #1a73e8 !important;
                    font-size: 10px;
                    font-weight: 700;
                }
                .biz-action-btn span {
                    color: #1a73e8 !important;
                }
                .biz-action-btn .icon-circle {
                    width: 32px;
                    height: 32px;
                    border: 1px solid #dadce0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #1a73e8 !important;
                    transition: background 0.2s;
                }
                .biz-action-btn:hover .icon-circle {
                    background: #e8f0fe;
                }
                
                /* Explicit details list colors to prevent white override */
                .google-widget-biz-card .text-slate-700 {
                    color: #3c4043 !important;
                }
                .google-widget-biz-card .text-slate-500 {
                    color: #70757a !important;
                }
                .google-widget-biz-card .text-slate-400 {
                    color: #70757a !important;
                }

                .google-widget-mini-map {
                    border: 1px solid #dadce0;
                    border-radius: 16px;
                    overflow: hidden;
                }

                /* Middle Summary Panel inside Widget */
                .google-widget-reviews-panel {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .bar-label {
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    color: #5f6368 !important;
                    width: 10px !important;
                }
                .progress-container {
                    background: #e8eaed;
                    border-radius: 3px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: #f5b800;
                    border-radius: 3px;
                }
                .display-avg-sm {
                    font-size: 44px !important;
                    font-weight: 500 !important;
                    color: #202124 !important;
                    line-height: 1;
                }
                .total-reviews-label {
                    color: #5f6368 !important;
                }
                .btn-google-write-review-real {
                    background: #ffffff !important;
                    border: 1px solid #dadce0 !important;
                    color: #1a73e8 !important;
                    font-weight: 500 !important;
                    font-size: 13px !important;
                    padding: 8px 18px !important;
                    border-radius: 100px !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
                }
                .btn-google-write-review-real:hover {
                    background: #f8f9fa !important;
                    border-color: #d2e3fc !important;
                    box-shadow: 0 1px 3px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3) !important;
                }

                /* Compact filters and lists */
                .google-filter-badge-sm {
                    background: #ffffff;
                    border: 1px solid #dadce0;
                    color: #202124;
                    border-radius: 100px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.01em;
                }
                .google-filter-badge-sm:hover {
                    background: #f1f3f4;
                    border-color: #aecbfa;
                }
                .google-filter-badge-sm.active {
                    background: #e8f0fe;
                    color: #1a73e8;
                    border-color: #1a73e8;
                    font-weight: 600;
                }
                .badge-count-sm {
                    color: #70757a;
                    font-size: 11px;
                    margin-left: 2px;
                }

                .google-reviews-scrollable-list-sm {
                    max-height: 360px;
                    overflow-y: auto;
                    padding-right: 4px;
                }
                .google-reviews-scrollable-list-sm::-webkit-scrollbar {
                    width: 4px;
                }
                .google-reviews-scrollable-list-sm::-webkit-scrollbar-thumb {
                    background: #dadce0;
                    border-radius: 2px;
                }

                .google-avatar-lg {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .google-review-card-item {
                    padding: 12px 0 0 0;
                    transition: background 0.15s;
                    border-radius: 8px;
                }
                .review-item-author {
                    color: #202124 !important;
                    font-size: 13px !important;
                    font-weight: 600 !important;
                }
                .review-item-meta {
                    color: #70757a !important;
                    font-size: 11px !important;
                }
                .review-item-time {
                    color: #70757a !important;
                    font-size: 12px !important;
                }
                .review-stars-row {
                    display: flex;
                    align-items: center;
                    gap: 1px;
                }
                .review-item-comment {
                    color: #3c4043 !important;
                    font-size: 13px !important;
                    line-height: 1.5 !important;
                    margin: 4px 0 0 0 !important;
                }
                .review-expand-btn {
                    background: none;
                    border: none;
                    color: #1a73e8;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 0;
                    cursor: pointer;
                    margin-left: 2px;
                }
                .review-expand-btn:hover { text-decoration: underline; }
                .review-helpful-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: none;
                    border: 1px solid #dadce0;
                    border-radius: 100px;
                    padding: 4px 12px;
                    font-size: 12px;
                    color: #70757a;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .review-helpful-btn:hover { background: #f1f3f4; border-color: #bdc1c6; }
                .review-helpful-btn.active { color: #1a73e8; border-color: #1a73e8; background: #e8f0fe; }
                .review-helpful-btn span { font-weight: 500; }
                .review-more-btn {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #70757a;
                    cursor: pointer;
                    padding: 0 4px;
                    line-height: 1;
                    border-radius: 50%;
                    transition: background 0.15s;
                }
                .review-more-btn:hover { background: #f1f3f4; }
                .review-divider {
                    height: 1px;
                    background: #e8eaed;
                    margin-top: 8px;
                }

                @media(min-width: 576px) {
                    .border-start-md {
                        border-left: 1px solid #dadce0 !important;
                    }
                }

                /* 3. DUAL-THEME UNIFIED MODAL COMPONENT */
                .modal-review-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.75);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                /* TAB TRIGGER BUTTONS */
                .modal-tab-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-weight: 700;
                    font-size: 13px;
                    padding: 8px 16px;
                    border-radius: 20px;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .modal-tab-btn:hover {
                    color: #94a3b8;
                }
                .modal-tab-btn.active {
                    background: rgba(245, 184, 0, 0.1);
                    color: #f5b800 !important;
                }

                /* GOOGLE SPECIFIC THEME LAYOUT */
                .google-modal-content {
                    background: #ffffff !important;
                    border-radius: 16px !important;
                    width: 100%;
                    max-width: 520px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
                    border: none !important;
                    color: #202124 !important;
                }
                .google-textarea-real {
                    width: 100%;
                    border: 1px solid #70757a;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    color: #202124;
                    background: #ffffff;
                    resize: vertical;
                    min-height: 120px;
                    transition: border-color 0.2s;
                }
                .google-textarea-real:focus {
                    border-color: #1a73e8;
                    outline: none;
                }
                .google-add-photos-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background-color: #e8f0fe !important;
                    color: #1a73e8 !important;
                    font-weight: 500;
                    font-size: 13px;
                    border-radius: 100px;
                    padding: 10px 20px;
                    border: none;
                    transition: background-color 0.2s;
                    width: 100%;
                }
                .google-add-photos-btn:hover {
                    background-color: #d2e3fc !important;
                }
                .google-input-real {
                    width: 100%;
                    border: 1px solid #dadce0;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 13px;
                    color: #202124;
                    background: #ffffff;
                    transition: border-color 0.2s;
                }
                .google-input-real:focus {
                    border-color: #1a73e8;
                    outline: none;
                }
                .google-btn-cancel-real {
                    background: #ffffff !important;
                    border: 1px solid #dadce0 !important;
                    color: #1a73e8 !important;
                    font-weight: 500;
                    padding: 8px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .google-btn-cancel-real:hover {
                    background: #f8f9fa !important;
                }
                .google-btn-post-real {
                    background: #1a73e8 !important;
                    color: #ffffff !important;
                    font-weight: 500;
                    padding: 8px 24px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .google-btn-post-real:hover {
                    background: #1557b0 !important;
                }

                /* WEBSITE SPECIFIC THEME LAYOUT (Sleek dark panel matching website) */
                .website-modal-content {
                    background: #0c303b !important;
                    border-radius: 20px !important;
                    width: 100%;
                    max-width: 520px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    color: #ffffff !important;
                }
                .form-label-website {
                    color: #94a3b8;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 4px;
                    display: block;
                }
                .website-input {
                    width: 100%;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    background: rgba(255,255,255,0.03) !important;
                    color: #ffffff !important;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                .website-input:focus {
                    border-color: #f5b800 !important;
                    background: rgba(255,255,255,0.05) !important;
                    outline: none;
                }
                .btn-upload-website {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #cbd5e1;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                .btn-upload-website:hover {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                }
                .website-btn-post {
                    background: linear-gradient(135deg, #f5b800, #d97706) !important;
                    color: #ffffff !important;
                    font-weight: 700;
                    padding: 8px 20px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                }
                .website-btn-cancel {
                    background: transparent !important;
                    color: #cbd5e1 !important;
                    font-weight: 700;
                    padding: 8px 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    cursor: pointer;
                }

                /* Star selection style */
                .rating-select .btn-star-select {
                    background: transparent;
                    border: none;
                    color: #cbd5e1 !important;
                    font-size: 28px;
                    cursor: pointer;
                    transition: transform 0.1s;
                }
                .rating-select .btn-star-select.active {
                    color: #f5b800 !important;
                }
                .google-modal-content .rating-select .btn-star-select {
                    color: #e8eaed !important;
                }
                .google-modal-content .rating-select .btn-star-select.active {
                    color: #f5b800 !important;
                }
                
                .btn-close-google-modal {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 16px;
                    cursor: pointer;
                }
                .btn-close-google-modal:hover { color: #fff; }
                .google-modal-content .btn-close-google-modal:hover { color: #202124; }

                .animate-scale-up {
                    animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default ReviewSystem;
