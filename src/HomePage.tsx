import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = (
    ((user.firstName?.[0] ?? user.email[0] ?? '') +
      (user.lastName?.[0] ?? '')
    ).toUpperCase()
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-glow auth-glow--top" />
        <div className="auth-glow auth-glow--bottom" />

        <div className="auth-header">
          <span className="auth-pill">You&apos;re in</span>
          <h1 className="auth-title">
            Welcome{user.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="auth-subtitle">
            This is your personal landing space. From here you can head to your homepage,
            update your details, or simply log out.
          </p>
        </div>

        <div className="profile-header">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar">{initials || 'U'}</div>
          )}

          <div className="profile-meta">
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
              {user.email}
            </div>
          </div>
        </div>

        {user.homepageRedirect && (
          <div className="profile-chip">
            <span>Homepage:</span>
            <span>{user.homepageRedirect}</span>
          </div>
        )}

        <div className="profile-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const target = user.homepageRedirect || '/';
              if (target.startsWith('http')) {
                window.open(target, '_blank');
              } else {
                navigate(target);
              }
            }}
          >
            Go to homepage
          </button>
          <button type="button" className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;