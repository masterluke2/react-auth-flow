import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setServerError(null);
    try {
      await registerUser(data.email, data.password);
      navigate('/setup-account');
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
          <span className="auth-pill">Step 1 of 2</span>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Start with your login details, then we&apos;ll help you personalize your
            profile.
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
              placeholder="At least 6 characters"
              {...registerField('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`field-input ${
                errors.confirmPassword ? 'field-input--error' : ''
              }`}
              placeholder="Repeat your password"
              {...registerField('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Continue to profile'}
          </button>

          <div className="auth-footer">
            <span className="text-muted">Already have an account?</span>
            <Link to="/login" className="link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;