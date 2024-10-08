import { Route, Redirect, Switch, RouteProps } from 'react-router-dom';
import { useStore } from '../../state/storeHooks';
import { Login } from '../Pages/Login/Login';
import { ForgotPassword } from '../Pages/ForgotPassword/ForgotPassword';
import { CodeVerification } from '../Pages/CodeVerification/CodeVerification';
import { PasswordChange } from '../Pages/ChangePassword/ChangePassword';
import { ErrorPage } from '../ErrorPage/ErrorPage';

const GuestRoutes = () => {
    const { user } = useStore(({ app }) => app);
    const isUserLoggedIn = user.isSome()
    const routes = [
        { path: '/resetpassword', component: PasswordChange },
        { path: '/login', component: Login },
        { path: '/forgotpassword', component: ForgotPassword },
        { path: '/verify-reset-password-code', component: CodeVerification },
        { path: '/error-page', component: ErrorPage },
    ];
    return (
        <Switch>
            {routes.map(({ path, component: Component }) => (
                <GuestOnlyRoute key={path} exact path={path} isUserLoggedIn={isUserLoggedIn}>
                    <Component />
                </GuestOnlyRoute>
            ))}
            <Route path='/'> {isUserLoggedIn ? <Redirect to='/home' /> : <Redirect to='/login' />} </Route>
            <Route path='*'> {isUserLoggedIn ? <Redirect to='/home' /> : <Redirect to='/login' />} </Route>
        </Switch>
    )
}

const GuestOnlyRoute = ({
    children,
    isUserLoggedIn,
    ...rest
}: { children: JSX.Element | JSX.Element[]; isUserLoggedIn: boolean } & RouteProps) => {
    return (
        <Route {...rest}>
            {children}
            {isUserLoggedIn && <Redirect to='/' />}
        </Route>
    );
}
export default GuestRoutes;