import { selectSongBeingEdited, updateSongContent } from "../store/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import Editor from "../components/Editor";
import EditorDrawer from "../components/EditorDrawer";
import EditorMobileTopNav from "../components/EditorMobileTopNav";
import EditorOptionsBar from "../components/EditorOptionsBar";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import FormatApi from "../api/FormatApi";
import PageTitle from "../components/PageTitle";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import SongApi from "../api/SongApi";
import { html } from "../utils/SongUtils";
import { isEmpty } from "../utils/ObjectUtils";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { useHistory } from "react-router";

export default function EditorWorkbenchPage() {
  const songBeingEdited = useSelector(selectSongBeingEdited);
  const [showEditorDrawer, setShowEditorDrawer] = useState(false);
  const [format, setFormat] = useState({});
  const [savingUpdates, setSavingUpdates] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showEditor, setShowEditor] = useState(true);

  const [changes, setChanges] = useState({ format: {} });

  const router = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(songBeingEdited)) {
      router.push("/songs");
    } else {
      let format = songBeingEdited.format;
      setFormat(format);
      document.title = songBeingEdited.name + " | Editor";
    }
  }, [songBeingEdited, router]);

  const handleGoBack = () => {
    dispatch(setSetlistBeingPresented({}));
    router.goBack();
  };

  const handleFormatChange = (formatOption, value) => {
    setDirty(true);
    let formatOptionsCopy = { ...format };
    formatOptionsCopy[formatOption] = value;
    setFormat(formatOptionsCopy);
    setChanges((currentChanges) => ({
      ...currentChanges,
      format: { ...currentChanges.format, [formatOption]: value },
    }));
  };

  const handleSaveChanges = () => {
    if ("content" in changes) {
      SongApi.updateOneById(songBeingEdited.id, {
        content: changes.content,
      });
      dispatch(updateSongContent(changes.content));
    }

    if (changes.format) {
      FormatApi.updateOneById(songBeingEdited.id, changes.format);
    }

    setSavingUpdates(false);
    setDirty(false);
    setChanges({ format: {} });
  };

  const handleContentChange = (newContent) => {
    setChanges((currentChanges) => ({
      ...currentChanges,
      content: newContent,
    }));
    setDirty(true);
  };

  if (!songBeingEdited || isEmpty(songBeingEdited)) {
    return null;
  }

  return (
    <>
      <div className="sm:hidden">
        <EditorMobileTopNav
          song={songBeingEdited}
          onShowEditorDrawer={() => setShowEditorDrawer(true)}
          onGoBack={handleGoBack}
        />
        <EditorDrawer
          formatOptions={format}
          open={showEditorDrawer}
          onClose={() => setShowEditorDrawer(false)}
          onFormatChange={handleFormatChange}
        />
        <div className="fixed w-full bottom-0 p-3 z-20">
          <Button
            full
            disabled={!dirty}
            onClick={handleSaveChanges}
            loading={savingUpdates}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div className="hidden sm:block fixed w-full bg-white dark:bg-dark-gray-900 z-50">
        <div className="px-3 container mx-auto flex-between">
          <div className="flex items-center">
            <span className="mr-4">
              <Button variant="open" size="xs" onClick={handleGoBack}>
                <ArrowNarrowLeftIcon className="text-gray-600 h-6 w-6" />
              </Button>
            </span>
            <PageTitle title={songBeingEdited.name} />
          </div>
          <span>
            <Button
              disabled={!dirty}
              onClick={handleSaveChanges}
              loading={savingUpdates}
            >
              Save Changes
            </Button>
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-dark-gray-700 py-3 px-5 border-t border-gray-200 dark:border-dark-gray-600 border-b sticky top-0">
          <EditorOptionsBar
            formatOptions={format}
            onFormatChange={handleFormatChange}
          />
        </div>
      </div>
      <div className="hidden xl:grid grid-cols-2 overflow-x-hidden pt-24">
        <div className="col-span-2 xl:col-span-1 container mx-auto px-5 mb-12 sm:mb-0 border-r dark:border-dark-gray-600 ">
          <Editor
            content={
              "content" in changes ? changes.content : songBeingEdited.content
            }
            formatOptions={format}
            onContentChange={handleContentChange}
          />
        </div>
        <div className="px-5 my-3 hidden xl:block">
          <PageTitle title="Preview" className="mb-4" />

          <div className="relative">
            {html({
              content:
                "content" in changes
                  ? changes.content
                  : songBeingEdited.content,
              format: format,
            })}
          </div>
        </div>
      </div>
      <div className="xl:hidden px-2 md:px-10 mb-28 sm:pt-28">
        {showEditor ? (
          <Editor
            content={
              "content" in changes ? changes.content : songBeingEdited.content
            }
            formatOptions={format}
            onContentChange={handleContentChange}
          />
        ) : (
          <div>
            <PageTitle title="Preview" className="my-4" />
            <div className="relative">
              {html({
                content:
                  "content" in changes
                    ? changes.content
                    : songBeingEdited.content,
                format: format,
              })}
            </div>
          </div>
        )}
        {showEditor ? (
          <Button
            onClick={() => setShowEditor(false)}
            variant="open"
            className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
          >
            <EyeIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowEditor(true)}
            variant="open"
            className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
          >
            <PencilIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </>
  );
}
