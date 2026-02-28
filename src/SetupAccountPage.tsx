import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type SetupAccountFormInputs = {
  firstName: string;
  lastName: string;
  homepageRedirect: string;
  profilePhoto: FileList;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

const SetupAccountPage: React.FC = () => {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupAccountFormInputs>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      homepageRedirect: user?.homepageRedirect ?? '/',
    },
  });

  const onSubmit: SubmitHandler<SetupAccountFormInputs> = async (data) => {
    setServerError(null);
    try {
      let photoDataUrl: string | undefined = user?.profilePhoto;

      const file = data.profilePhoto?.[0];
      if (file) {
        photoDataUrl = await fileToDataUrl(file);
      }

      const updatedUser = await completeProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        homepageRedirect: data.homepageRedirect,
        profilePhoto: photoDataUrl,
      });

      navigate(updatedUser.homepageRedirect || '/');
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  const initials = (
    ((user?.firstName?.[0] ?? user?.email?.[0] ?? '') +
      (user?.lastName?.[0] ?? '')
    ).toUpperCase()
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-glow auth-glow--top" />
        <div className="auth-glow auth-glow--bottom" />

        <div className="auth-header">
          <span className="auth-pill">Step 2 of 2</span>
          <h1 className="auth-title">Set up your profile</h1>
          <p className="auth-subtitle">
            Add a face to your name and choose where you&apos;d like to land after
            signing in.
          </p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-header">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar">{initials || 'U'}</div>
            )}
            <div className="profile-meta">
              <div>{user?.firstName || 'New user'}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="profilePhoto">
              Profile photo
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className={`field-input field-input--file ${
                errors.profilePhoto ? 'field-input--error' : ''
              }`}
              {...register('profilePhoto', {
                validate: (files: FileList) =>
                  (files && files.length > 0) || 'Profile photo is required',
              })}
            />
            {errors.profilePhoto && (
              <p className="field-error">
                {errors.profilePhoto.message as string}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              className={`field-input ${errors.firstName ? 'field-input--error' : ''}`}
              placeholder="Jordan"
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
            {errors.firstName && (
              <p className="field-error">{errors.firstName.message}</p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              className={`field-input ${errors.lastName ? 'field-input--error' : ''}`}
              placeholder="Lee"
              {...register('lastName', {
                required: 'Last name is required',
              })}
            />
            {errors.lastName && (
              <p className="field-error">{errors.lastName.message}</p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="homepageRedirect">
              Homepage redirect
            </label>
            <input
              id="homepageRedirect"
              type="url"
              className={`field-input ${
                errors.homepageRedirect ? 'field-input--error' : ''
              }`}
              placeholder="https://example.com or /dashboard"
              {...register('homepageRedirect', {
                required: 'Homepage redirect is required',
                pattern: {
                  value: /^((https?:\/\/)[^\s]+|\/[^\s]*)$/i,
                  message: 'Use a full URL or a path starting with "/"',
                },
              })}
            />
            {errors.homepageRedirect && (
              <p className="field-error">{errors.homepageRedirect.message}</p>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving your profile…' : 'Save & go to homepage'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupAccountPage;