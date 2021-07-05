import { Button, Center, Loader } from '@mantine/core';
import clsx from 'clsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

const { createFFmpeg, fetchFile } = (window as any).FFmpeg;
const ffmpeg = createFFmpeg();

function App() {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'audio/*' });

  const [audioFiles, setAudioFiles] = React.useState(
    {} as Record<string, string>,
  );
  const [zipFile, setZipFile] = React.useState(null as null | JSZip);

  React.useEffect(() => {
    if (acceptedFiles.length > 0) {
      handle();

      async function handle() {
        await ffmpeg.load();
        const urls = {} as Record<string, string>;
        setAudioFiles({ ...urls });
        const zip = new JSZip();
        for (const file of acceptedFiles) {
          ffmpeg.FS('writeFile', file.name, await fetchFile(file));
          await ffmpeg.run('-i', file.name, 'output.ogg');
          const data = ffmpeg.FS('readFile', 'output.ogg');

          const blob = new Blob([data], { type: 'audio/ogg' });

          urls[file.name] = URL.createObjectURL(blob);
          zip.file(file.name.replace(/\.\w+$/, 'ogg'), blob);
          setAudioFiles({ ...urls });
        }
        setZipFile(zip);
      }
    }
  }, [acceptedFiles]);

  return (
    <div className="App">
      <header className="App-header">Audio Converter</header>
      <div className="Dropzone-container">
        <div
          {...getRootProps({
            className: clsx(
              'Dropzone',
              isDragActive && 'Dropzone-active',
              isDragAccept && 'Dropzone-accept',
              isDragReject && 'Dropzone-reject',
            ),
          })}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <ul className="File-list">
          {acceptedFiles.map((file) => (
            <li key={file.name} className="File">
              <div>{!audioFiles[file.name] ? <Loader size="sm" /> : null}</div>
              <div>{file.name}</div>
              {audioFiles[file.name] ? (
                <audio
                  className="Player"
                  controls
                  src={audioFiles[file.name]}
                />
              ) : (
                <div />
              )}
            </li>
          ))}
        </ul>
        {zipFile ? (
          <Center>
            <Button
              onClick={() =>
                zipFile
                  .generateAsync({ type: 'blob' })
                  .then((content) => saveAs(content, 'audio.zip'))
              }
            >
              Download all
            </Button>
          </Center>
        ) : null}
      </div>
    </div>
  );
}

export default App;
