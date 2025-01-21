import { useState } from 'react';
import {
  FaFacebookF,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { useAppSelector } from '../hooks/hooks';

export default function SocialLinks() {
  const settings = useAppSelector((state) => state.settings.settings);
  const [displayMode] = useState<boolean>(() => {
    const localDisplayMode = localStorage.getItem('displayMode');
    return localDisplayMode === 'dark' ? true : false;
  });

  return (
    <div className="flex gap-x-1 mt-2">
      <a href={settings.twitter}>
        <FaXTwitter
          style={{
            color: displayMode ? '#4AEFAA' : '#3D4AE4',
            fontSize: '24px',
          }}
        />
      </a>
      <a href={settings.facebook}>
        <FaFacebookF
          style={{
            color: displayMode ? '#4AEFAA' : '#3D4AE4',
            fontSize: '24px',
          }}
        />
      </a>
      <a href={settings.linkedIn}>
        <FaLinkedin
          style={{
            color: displayMode ? '#4AEFAA' : '#3D4AE4',
            fontSize: '24px',
          }}
        />
      </a>
      <a href={settings.youtube}>
        <FaYoutube
          style={{
            color: displayMode ? '#4AEFAA' : '#3D4AE4',
            fontSize: '24px',
          }}
        />
      </a>
    </div>
  );
}
