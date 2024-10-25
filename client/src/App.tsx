import { Route, Routes } from 'react-router-dom';
import NotFound from './components/NotFound';
import ErrorRedirect from './components/RedirectLanding/ErrorRedirect';
import ExpiredRedirect from './components/RedirectLanding/ExpiredRedirect';
import SuccessRedirect from './components/RedirectLanding/SuccessRedirect';
import ManageSubscriptions from './components/UserSubscriptions';
import SearchContainer from './components/Search/SearchContainer';
import { SnackbarProvider } from './context/snackbar.context';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import BlacklistRedirect from './components/RedirectLanding/BlacklistRedirect';
import { SubscriptionProvider } from './context/subscription.context';

const App: React.FC = () => {
    return (
        <SnackbarProvider>
            <SubscriptionProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path='/' element={<LoginForm />} />

                    {/* Private Routes */}
                    <Route path='/dashboard' element={<ProtectedRoute Component={SearchContainer} />} />
                    <Route path='/manage-subscriptions' element={<ProtectedRoute Component={ManageSubscriptions} />} />

                    {/* Utility Routes */}
                    <Route path='/redirect' element={<SuccessRedirect />} />
                    <Route path='/blacklist' element={<BlacklistRedirect />} />
                    <Route path='/error' element={<ErrorRedirect />} />
                    <Route path='/expired' element={<ExpiredRedirect />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </SubscriptionProvider>
        </SnackbarProvider>
    );
};

export default App;
