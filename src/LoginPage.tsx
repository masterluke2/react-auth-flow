import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setServerError(null);
    try {
      const user = await login(data.email, data.password);

      if (!user.firstName || !user.lastName || !user.homepageRedirect) {
        navigate('/setup-account');
      } else {
        navigate(user.homepageRedirect || '/');
      }
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-glow auth-glow--top" />
        <div className="auth-glow auth-glow--bottom" />

        <div className="auth-header">
          <span className="auth-pill">Welcome back</span>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">
            Access your workspace, finish setting up your profile, or tweak your homepage
            in a few clicks.
          </p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`field-input ${errors.email ? 'field-input--error' : ''}`}
              placeholder="you@example.com"
              {...registerField('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`field-input ${errors.password ? 'field-input--error' : ''}`}
              placeholder="••••••••"
              {...registerField('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging you in…' : 'Login'}
          </button>

          <div className="auth-footer">
            <span className="text-muted">Don&apos;t have an account?</span>
            <Link to="/register" className="link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;