import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import NoDataMessage from "../components/NoDataMessage";
import SetPresenterBottomSheet from "../components/SetPresenterBottomSheet";
import SetPresenterTopBar from "../components/SetPresenterTopBar";
import SetlistAdjustmentsDrawer from "../components/SetlistAdjustmentsDrawer";
import SetlistApi from "../api/SetlistApi";
import SetlistNavigation from "../components/SetlistNavigation";
import SongsCarousel from "../components/SongsCarousel";
import { selectSetlistBeingPresented } from "../store/presenterSlice";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { useState } from "react";

export default function SetPresenter() {
  const setlist = useSelector(selectSetlistBeingPresented);
  const [songs, setSongs] = useState([]);
  const [songBeingViewedIndex, setSongBeingViewedIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheet, setBottomSheet] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    let { data } = SetlistApi.getOne(id);
    dispatch(setSetlistBeingPresented(data));
  }, [id, dispatch]);

  useEffect(() => {
    if (setlist?.songs) {
      setSongs(
        setlist.songs.map((song) => ({
          ...song,
          show_transposed: Boolean(song.transposed_key),
          show_roadmap: song.roadmap?.length > 0,
        }))
      );
    }
  }, [setlist]);

  function handleSongBeingViewedIndexChange(index) {
    let html = document.querySelector("html");
    html.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSongBeingViewedIndex(index);
  }

  function handleBottomSheetChange(sheet) {
    setShowDrawer(false);
    setShowBottomSheet(true);
    setBottomSheet(sheet);
  }

  const handleSongUpdate = useCallback(
    (field, value) => {
      setSongs((currentSongs) => {
        return currentSongs.map((song, index) => {
          return index === songBeingViewedIndex
            ? { ...song, [field]: value }
            : song;
        });
      });
    },
    [songBeingViewedIndex]
  );

  if (setlist?.songs) {
    return (
      <>
        <SetPresenterTopBar
          song={songs[songBeingViewedIndex]}
          onShowBottomSheet={handleBottomSheetChange}
          onShowDrawer={() => setShowDrawer(true)}
        />
        <div className="mx-auto max-w-4xl p-3 whitespace-pre-wrap mb-12">
          <SongsCarousel
            songs={songs}
            onIndexChange={handleSongBeingViewedIndexChange}
            index={songBeingViewedIndex}
            onSongUpdate={handleSongUpdate}
          />
        </div>

        <SetlistNavigation
          songs={setlist.songs}
          onIndexChange={handleSongBeingViewedIndexChange}
          index={songBeingViewedIndex}
        />
        <SetPresenterBottomSheet
          sheet={bottomSheet}
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          song={songs[songBeingViewedIndex]}
          onSongUpdate={handleSongUpdate}
        />
        <SetlistAdjustmentsDrawer
          song={songs[songBeingViewedIndex]}
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSongUpdate={handleSongUpdate}
          onShowBottomSheet={handleBottomSheetChange}
        />
      </>
    );
  } else {
    return (
      <CenteredPage>
        <NoDataMessage>
          <div className="mb-2">This set has no songs</div>
          <Link to={`/sets/${id}`}>
            <Button>Go back</Button>
          </Link>
        </NoDataMessage>
      </CenteredPage>
    );
  }
}
