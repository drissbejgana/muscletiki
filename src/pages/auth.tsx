import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window { google: any; }
}

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleScriptLoaded = useRef(false);

  if (user) navigate("/");

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Load Google Identity Services script
  useEffect(() => {
    if (googleScriptLoaded.current || !GOOGLE_CLIENT_ID) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleScriptLoaded.current = true;
      initializeGoogle();
    };
    document.head.appendChild(script);
  }, []);

  // Re-initialize Google button when toggling login/register
  useEffect(() => {
    if (googleScriptLoaded.current) {
      initializeGoogle();
    }
  }, [isLogin]);

  const initializeGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID || !googleBtnRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      googleBtnRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 360,
        text: isLogin ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'center',
      });
    } catch (err) {
      console.error('Google Sign-In init error:', err);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    if (!response.credential) {
      setError(t('auth.googleError'));
      return;
    }

    setGoogleLoading(true);
    setError('');

    try {
      const data = await authService.googleLogin(response.credential);
      const loggedUser = data.user;

      if (loggedUser.role === "admin") {
        localStorage.removeItem('fitness_app_restriction_time');
        window.location.href = '/admin';
      } else if (loggedUser.subscription?.plan === "free") {
        window.location.href = '/subscription';
      } else {
        localStorage.removeItem('fitness_app_restriction_time');
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || err || t('auth.googleError'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (isLogin) {
        const { user } = await authService.login(formData.email, formData.password);
        if (user.role === "admin") { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/admin'; }
        else if (user.subscription.plan === "free") { window.location.href = '/subscription'; }
        else if (user.subscription.plan === "pro" || user.subscription.plan === "premium") { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/'; }
      } else {
        if (formData.password !== formData.confirmPassword) { setError(t('auth.passwordsNoMatch')); setLoading(false); return; }
        await authService.register(formData.name, formData.email, formData.password);
        setSuccess(t('auth.accountCreated'));
        window.location.href = '/';
        setTimeout(() => { setIsLogin(true); setFormData({ name: '', email: '', password: '', confirmPassword: '' }); setSuccess(''); }, 2000);
      }
    } catch (err: any) {
      setError(err.message || t('auth.genericError'));
    } finally { setLoading(false); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false); setError(''); setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#294B8E] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}</h1>
            <p className="text-blue-100">{isLogin ? t('auth.signInContinue') : t('auth.signUpStart')}</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Google Sign-In */}
            <div className="mb-6">
              {GOOGLE_CLIENT_ID ? (
                <>
                  <div ref={googleBtnRef} className="flex justify-center w-full" style={{ minHeight: '44px' }} />
                  {googleLoading && (
                    <div className="flex items-center justify-center mt-2">
                      <svg className="animate-spin h-5 w-5 text-[#294B8E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span className="ml-2 text-sm text-gray-600">{t('auth.connectingGoogle')}</span>
                    </div>
                  )}
                </>
              ) : (
                <button type="button" disabled className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span className="text-sm font-medium">{t('auth.googleNotConfigured')}</span>
                </button>
              )}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">{t('auth.orContinueWith')}</span></div>
            </div>

            <div className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294B8E] focus:border-transparent transition" placeholder="John Doe" disabled={loading} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294B8E] focus:border-transparent transition" placeholder="you@example.com" disabled={loading} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294B8E] focus:border-transparent transition" placeholder="••••••••" disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" disabled={loading}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294B8E] focus:border-transparent transition" placeholder="••••••••" disabled={loading} />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#294B8E] border-gray-300 rounded focus:ring-[#294B8E]" disabled={loading} />
                    <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe')}</span>
                  </label>
                  <a href="#" className="text-sm text-[#294B8E] hover:underline font-medium">{t('auth.forgotPassword')}</a>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#294B8E] text-white py-3 rounded-lg font-semibold hover:bg-[#1f3a6e] transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                  </span>
                ) : (isLogin ? t('auth.signIn') : t('auth.createAccount'))}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                <button type="button" onClick={toggleForm} className="text-[#294B8E] font-semibold hover:underline disabled:opacity-50" disabled={loading}>
                  {isLogin ? t('auth.signUpLink') : t('auth.signInLink')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
