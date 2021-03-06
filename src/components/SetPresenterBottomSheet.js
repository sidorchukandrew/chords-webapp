import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import CapoSheet from './CapoSheet';
import TransposeSheet from './TransposeSheet';
import { hasAnyKeysSet } from '../utils/SongUtils';
import SessionsSheet from './SessionsSheet';

export default function SetPresenterBottomSheet({
  song,
  sheet,
  open,
  onClose,
  onSongUpdate,
}) {
  function isHidden(sheetInQuestion) {
    return sheet === sheetInQuestion ? '' : 'hidden';
  }

  return (
    <BottomSheet open={open} onClose={onClose} className="p-2">
      {song && (
        <>
          {hasAnyKeysSet(song) && (
            <>
              <CapoSheet
                song={song}
                onCapoChange={capo => onSongUpdate('capo', capo)}
                className={isHidden('capo')}
              />
              <TransposeSheet
                song={song}
                onSongChange={onSongUpdate}
                className={isHidden('transpose')}
              />
            </>
          )}
          <AutoscrollSheet
            song={song}
            onSongChange={onSongUpdate}
            className={isHidden('autoscroll')}
            bottomSheetOpen={open}
            shortcutClasses="bottom-16 right-4"
          />
          <SessionsSheet className={isHidden('sessions')} onClose={onClose} />
        </>
      )}
    </BottomSheet>
  );
}
