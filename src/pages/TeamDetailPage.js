import {
  selectCurrentMember,
  selectCurrentTeam,
  setCurrentTeam,
} from '../store/authSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EDIT_TEAM, MANAGE_BILLING } from '../utils/constants';
import FileApi from '../api/FileApi';
import MobileProfilePictureMenu from '../components/mobile menus/MobileProfilePictureMenu';
import PageTitle from '../components/PageTitle';
import ProfilePicture from '../components/ProfilePicture';
import TeamApi from '../api/TeamApi';
import _ from 'lodash';
import { format } from '../utils/date';
import { reportError } from '../utils/error';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import Badge from '../components/Badge';
import TeamSubscriptionSection from '../components/TeamSubscriptionSection';

export default function TeamDetailPage() {
  const currentTeam = useSelector(selectCurrentTeam);
  const currentSubscription = useSelector(selectCurrentSubscription);
  useEffect(
    () => (document.title = currentTeam ? currentTeam.name : 'Team Details')
  );

  const inputRef = useRef();
  const [showImageDialog, setShowImageDialog] = useState(false);
  const dispatch = useDispatch();
  const currentMember = useSelector(selectCurrentMember);

  const handleOpenFileDialog = () => {
    inputRef.current.click();
  };

  const handleImageSelected = async e => {
    let tempImageUrl = URL.createObjectURL(e.target.files[0]);
    dispatch(setCurrentTeam({ ...currentTeam, image_url: tempImageUrl }));

    try {
      setShowImageDialog(false);
      console.log(e.target.files[0]);
      try {
        await FileApi.addImageToTeam(e.target.files[0]);
      } catch (error) {
        reportError(error);
        dispatch(setCurrentTeam({ ...currentTeam, image_url: null }));
      } finally {
        URL.revokeObjectURL(tempImageUrl);
      }
    } catch (error) {
      reportError(error);
    }
  };

  const handleTeamImageClick = () => {
    if (currentMember.can(EDIT_TEAM)) {
      setShowImageDialog(true);
    }
  };

  const handleDeleteImage = async () => {
    try {
      dispatch(setCurrentTeam({ ...currentTeam, image_url: null }));
      await FileApi.deleteTeamImage();
    } catch (error) {
      reportError(error);
    }
  };

  const handleNameChange = newName => {
    dispatch(setCurrentTeam({ ...currentTeam, name: newName }));
    debounce(newName);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(newName => {
      try {
        TeamApi.update({ name: newName });
      } catch (error) {
        reportError(error);
      }
    }, 1000),
    []
  );

  if (currentTeam && currentSubscription) {
    return (
      <div className="flex items-center flex-col pt-4 max-w-sm mx-auto">
        <ProfilePicture
          url={currentTeam.image_url}
          size="lg"
          onClick={handleTeamImageClick}
        />
        <PageTitle
          title={currentTeam.name}
          align="center"
          editable={currentMember.can(EDIT_TEAM)}
          className="text-center"
          onChange={handleNameChange}
        />
        {currentMember.can(EDIT_TEAM) && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
              ref={inputRef}
            />
            <MobileProfilePictureMenu
              open={showImageDialog}
              onCloseDialog={() => setShowImageDialog(false)}
              onOpenFileDialog={handleOpenFileDialog}
              onDeleteImage={handleDeleteImage}
            />
          </>
        )}
        <div className="text-gray-600 dark:text-dark-gray-200 w-full">
          <div className="flex-between py-2">
            <div className="font-semibold">Created:</div>
            {format(currentTeam.created_at, 'MMM D YYYY')}
          </div>
          <div className="flex-between py-2">
            <div className="font-semibold">Plan:</div>
            <div>
              {currentSubscription.status === 'trialing' && (
                <Badge color="green" className="mr-2">
                  Trialing
                </Badge>
              )}
              {currentSubscription.plan_name}
            </div>
          </div>
          {currentMember.can(MANAGE_BILLING) && (
            <TeamSubscriptionSection subscription={currentSubscription} />
          )}
        </div>
      </div>
    );
  } else {
    return 'Loading...';
  }
}
