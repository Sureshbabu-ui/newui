import axios from 'axios';
import { Fragment } from 'react';
import { Suspense } from 'react';
import { useHistory } from "react-router"
import { BrowserRouter } from 'react-router-dom';
import { getUserProfile } from '../../services/login';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Header } from '../Header/Header';
import UserRoutes from '../Routes/UserRoutes';
import GuestRoutes from '../Routes/GuestRoutes';
import { endLoad, loadUser } from './App.slice';
import { Preloader } from '../Preloader/Preloader';
import { useMediaQuery } from 'react-responsive';
import { getLookupList } from '../../services/lookup';

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);
  const isUserLoggedIn = user.isSome();

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1000px)'
  })

  // Simple detection to check if the user is on Chrome
  const isChrome = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg');

  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        {isChrome ? <>
          {isDesktopOrLaptop ? <>
            {!loading && (
              <Fragment>
                <Preloader />
                <Header />
                {isUserLoggedIn ? <UserRoutes /> : <GuestRoutes />}
                {/* <Footer /> */}
              </Fragment>
            )}
          </> : <div className="app-primary-color mt-5 text-center">
            Screen size not supported. Please use a display with a minimum width of 1000 pixels.
          </div>
          }
        </>
          : <div className="app-primary-color mt-5 text-center">
            Your current browser is not supported. To access this page, please use Google Chrome. If you don't have Chrome installed, you can download it <a href="https://www.google.com/chrome/">here</a>
          </div>
        }
      </BrowserRouter>
    </Suspense>
  );
}

async function load() {
  const token = localStorage.getItem('token');
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Bearer ${token}`;
  axios.defaults.headers.common["Accept-Language"] = 'fr';

  try {
    // get user details API
    store.dispatch(loadUser(await getUserProfile()));
    const result = await getLookupList();
    localStorage.setItem('bsmasterdata', JSON.stringify(result));
  } catch {
    store.dispatch(endLoad());
  }
}