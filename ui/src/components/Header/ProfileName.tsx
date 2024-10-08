import React from 'react';
import { stringToColor } from '../../helpers/formats';
import { store } from '../../state/store';


export const getInitials = (fullName: any): string => {
  const names = fullName.split(' ');
  let initials = ''

  if (names.length === 1) {
    if (names[0] !== '') {
      initials = names[0].charAt(0) + names[0].charAt(1);
    } else {
      initials = "?";
    }
  } else if (names.length >= 2) {
    initials = names[0].charAt(0) + names[1].charAt(0);
  }
  return initials.toUpperCase();
};

interface ProfileNameProps {
  fullName: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ fullName }) => {
  const initials = getInitials(fullName);
  const backgroundColor = stringToColor(fullName);
  const circleStyle: React.CSSProperties = {
    background: backgroundColor,
  };

  return (

    <a href='/userinfo' className="nav-link" data-toggle="tooltip" data-placement="left" title={`${store.getState().app.user.unwrap().user[0].FullName}`}>
      <h4 className="profileName" style={circleStyle}>
        {initials}
      </h4>
    </a>

  );
};

export default ProfileName;
