import {
  Button,
  Center,
  Loader,
  MantineProvider,
  RingProgress,
  Text,
} from '@mantine/core';
import { CheckIcon } from '@modulz/radix-icons';
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
  const [currentFile, setCurrentFile] = React.useState('');
  const [currentProgress, setCurrentProgress] = React.useState(0);

  ffmpeg.setProgress(({ ratio }: any) => {
    setCurrentProgress(Math.round(ratio * 100));
  });

  React.useEffect(() => {
    if (acceptedFiles.length > 0) {
      handle();

      async function handle() {
        await ffmpeg.load();
        const urls = {} as Record<string, string>;
        setAudioFiles({ ...urls });
        const zip = new JSZip();
        for (const file of acceptedFiles) {
          setCurrentProgress(0);
          setCurrentFile(file.name);
          ffmpeg.FS('writeFile', file.name, await fetchFile(file));
          await ffmpeg.run('-i', file.name, 'output.ogg');
          console.log(ffmpeg.progress);
          const data = ffmpeg.FS('readFile', 'output.ogg');

          const blob = new Blob([data], { type: 'audio/ogg' });

          urls[file.name] = URL.createObjectURL(blob);
          zip.file(file.name.replace(/\.\w+$/, '.ogg'), blob);
          setAudioFiles({ ...urls });
        }
        setZipFile(zip);
      }
    }
  }, [acceptedFiles]);

  const [generating, setGenerating] = React.useState(false);

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
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
                <div>
                  <RingProgress
                    size={60}
                    thickness={8}
                    sections={[
                      {
                        value:
                          currentFile === file.name
                            ? currentProgress
                            : !audioFiles[file.name]
                            ? 0
                            : 100,
                        color: 'teal',
                      },
                    ]}
                    label={
                      <Center>
                        {!audioFiles[file.name] ? (
                          <Text size="xs">
                            {currentFile === file.name ? currentProgress : 0}%
                          </Text>
                        ) : (
                          <CheckIcon style={{ height: 22, width: 22 }} />
                        )}
                      </Center>
                    }
                  />
                </div>
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
                disabled={generating}
                onClick={() => {
                  setGenerating(true);
                  zipFile
                    .generateAsync({ type: 'blob' })
                    .then((content) => saveAs(content, 'audio.zip'))
                    .then(() => setGenerating(false));
                }}
              >
                {generating ? <Loader /> : null}
                Download all
              </Button>
            </Center>
          ) : null}
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
