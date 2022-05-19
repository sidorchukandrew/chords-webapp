import "react-alice-carousel/lib/alice-carousel.css";

import AliceCarousel from "react-alice-carousel";
import SongsCarouselSlide from "./SongsCarouselSlide";
import { useState } from "react";

export default function SongsCarousel({
  songs,
  index,
  onIndexChange,
  onSongUpdate,
}) {
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  function handleEnableSwiping() {
    setTimeout(() => {
      setIsSwipeEnabled(true);
    }, [100]);
  }

  function handleDisableSwiping() {
    setIsSwipeEnabled(false);
  }

  function buildTemplates() {
    return songs?.map((song) => (
      <SongsCarouselSlide
        key={song.id}
        song={song}
        onDeleteNote={handleDeleteNote}
        onUpdateNote={handleUpdateNote}
        onEnableSwipe={handleEnableSwiping}
        onDisableSwipe={handleDisableSwiping}
        onSongUpdate={onSongUpdate}
      />
    ));
  }

  function handleUpdateNote(noteId, updates) {
    let updatedNotes = songs[index].notes?.map((note) => {
      if (note.id === noteId) {
        return { ...note, ...updates };
      } else {
        return note;
      }
    });

    onSongUpdate("notes", updatedNotes);
  }

  function handleDeleteNote(noteId) {
    let updatedNotes = songs[index].notes?.filter((note) => note.id !== noteId);

    onSongUpdate("notes", updatedNotes);
  }

  return (
    <>
      <AliceCarousel
        mouseTracking={false}
        touchTracking={isSwipeEnabled}
        disableButtonsControls
        disableDotsControls
        disableSlideInfo
        items={buildTemplates()}
        onSlideChanged={(e) => onIndexChange(e.slide)}
        activeIndex={index}
        swipeDelta={100}
        autoHeight
        animationDuration={400}
      />
    </>
  );
}
