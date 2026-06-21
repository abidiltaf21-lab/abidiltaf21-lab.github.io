import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'swiper/css';
import 'swiper/css/bundle';
import 'react-modal-video/css/modal-video.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-photo-view/dist/react-photo-view.css';

import '../src/assets/css/smoooth-theme.css';
import '../src/assets/css/animate.css';
import '../src/assets/css/font-awesome.min.css';

import '../src/assets/css/validnavs.css';
import '../src/assets/css/helper.css';
import '../src/assets/css/unit-test.css';
import '../src/assets/css/style.css';
import '../src/assets/css/sp-cards.css';
import '../src/assets/css/sp-resume.css';
import '../src/assets/css/sp-rtl.css';
import '../src/assets/css/CustomNavigation.css';
import '../src/assets/css/admin.css';
import '../src/assets/css/buttons-override.css';

import Routers from './Routers';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import RoutesScrollToTop from './components/utilities/RoutesScrollToTop';
import Dependency from './components/utilities/Dependency';
import { useEffect, useState } from 'react';
import Preloader from './components/utilities/Preloader';
import VisitorTracker from './components/utilities/VisitorTracker';
import ThemeManager from './components/utilities/ThemeManager';
import FloatingChatWidget from './components/FloatingChatWidget';
import ServerWakeUp from './components/utilities/ServerWakeUp';

function App() {

  //  Preloader 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [])

  return (
    <>
      {isLoading ? <Preloader /> :
        <>
          <ServerWakeUp />
          <ThemeManager />
          <Routers />
          <FloatingChatWidget />
          <VisitorTracker />
          <RoutesScrollToTop />
          <ToastContainer />
          <Dependency />
          <Analytics />
        </>
      }
    </>
  )
}

export default App
