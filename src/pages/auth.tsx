import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Dumbbell, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

declare global { interface Window { google: any; } }

const InputField = ({
  label, name, type, value, onChange, placeholder, disabled, icon: Icon, rightEl,
}: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full bg-secondary border border-border rounded-xl py-3 pr-4 text-foreground placeholder:text-muted-foreground/50 text-sm",
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
          "disabled:opacity-50",
          Icon ? "pl-10" : "pl-4"
        )}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
  </div>
);

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

  useEffect(() => {
    if (googleScriptLoaded.current || !GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => { googleScriptLoaded.current = true; initializeGoogle(); };
    document.head.appendChild(script);
  }, []);

  useEffect(() => { if (googleScriptLoaded.current) initializeGoogle(); }, [isLogin]);

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
        type: 'standard', theme: 'outline', size: 'large',
        width: googleBtnRef.current.offsetWidth || 380,
        text: isLogin ? 'signin_with' : 'signup_with',
        shape: 'rectangular', logo_alignment: 'center',
      });
    } catch (err) { console.error('Google Sign-In init error:', err); }
  };

  const handleGoogleCallback = async (response: any) => {
    if (!response.credential) { setError(t('auth.googleError')); return; }
    setGoogleLoading(true); setError('');
    try {
      const data = await authService.googleLogin(response.credential);
      const loggedUser = data.user;
      const isExpired = loggedUser.subscription?.endDate && new Date(loggedUser.subscription.endDate) < new Date();
      if (loggedUser.role === "admin") { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/admin'; }
      else if (loggedUser.subscription?.plan === "free" || isExpired) { window.location.href = '/subscription'; }
      else { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/'; }
    } catch (err: any) { setError(err.message || err || t('auth.googleError')); }
    finally { setGoogleLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      if (isLogin) {
        const { user } = await authService.login(formData.email, formData.password);
        const isExpired = user.subscription?.endDate && new Date(user.subscription.endDate) < new Date();
        if (user.role === "admin") { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/admin'; }
        else if (user.subscription.plan === "free" || isExpired) { window.location.href = '/subscription'; }
        else { localStorage.removeItem('fitness_app_restriction_time'); window.location.href = '/'; }
      } else {
        if (formData.password !== formData.confirmPassword) { setError(t('auth.passwordsNoMatch')); setLoading(false); return; }
        await authService.register(formData.name, formData.email, formData.password);
        setSuccess(t('auth.accountCreated'));
        window.location.href = '/';
        setTimeout(() => { setIsLogin(true); setFormData({ name: '', email: '', password: '', confirmPassword: '' }); setSuccess(''); }, 2000);
      }
    } catch (err: any) { setError(err.message || t('auth.genericError')); }
    finally { setLoading(false); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false); setError(''); setSuccess('');
  };

  const benefits = [
    "Interactive 3D body map",
    "800K+ workouts generated",
    "Advanced calorie & macro tools",
    "Personal training programs",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding / benefits (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-card border-r border-border p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <span className="font-black text-xl">
              <span className="text-primary">Muscle</span>
              <span className="text-foreground">Tiki</span>
            </span>
          </div>

          <h2 className="text-4xl font-black text-foreground leading-tight mb-4">
            Train Smarter.<br />
            <span className="text-primary">Not Harder.</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-10">
            The all-in-one fitness platform built for athletes who want results.
          </p>

          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">{t('footer.rights')}</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-primary" />
            </div>
            <span className="font-black text-lg">
              <span className="text-primary">Muscle</span>
              <span className="text-foreground">Tiki</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-foreground mb-1">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            {isLogin ? t('auth.signInContinue') : t('auth.signUpStart')}
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-destructive/10 border border-destructive/25 text-destructive px-4 py-3 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-start gap-2.5 bg-primary/10 border border-primary/25 text-primary px-4 py-3 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Google sign-in */}
          <div className="mb-5">
            {GOOGLE_CLIENT_ID ? (
              <>
                <div ref={googleBtnRef} className="flex justify-center w-full [&>div]:w-full [&>div>div]:w-full" style={{ minHeight: 44 }} />
                {googleLoading && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    {t('auth.connectingGoogle')}
                  </div>
                )}
              </>
            ) : (
              <button disabled className="w-full flex items-center justify-center gap-3 bg-secondary border border-border rounded-xl py-3 text-muted-foreground text-sm cursor-not-allowed opacity-60">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                {t('auth.googleNotConfigured')}
              </button>
            )}
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">{t('auth.orContinueWith')}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <InputField label={t('auth.fullName')} name="name" type="text" value={formData.name}
                onChange={handleChange} placeholder="John Doe" disabled={loading} icon={User} />
            )}
            <InputField label={t('auth.email')} name="email" type="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com" disabled={loading} icon={Mail} />
            <InputField label={t('auth.password')} name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={loading} icon={Lock}
              rightEl={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors" disabled={loading}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            {!isLogin && (
              <InputField label={t('auth.confirmPassword')} name="confirmPassword"
                type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                onChange={handleChange} placeholder="••••••••" disabled={loading} icon={Lock} />
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border bg-secondary text-primary focus:ring-primary" disabled={loading} />
                  <span className="text-xs text-muted-foreground">{t('auth.rememberMe')}</span>
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">{t('auth.forgotPassword')}</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                </span>
              ) : (isLogin ? t('auth.signIn') : t('auth.createAccount'))}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button type="button" onClick={toggleForm} className="text-primary font-semibold hover:underline disabled:opacity-50" disabled={loading}>
              {isLogin ? t('auth.signUpLink') : t('auth.signInLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
