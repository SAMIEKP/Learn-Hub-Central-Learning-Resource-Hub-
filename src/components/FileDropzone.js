import { useDropzone } from 'react-dropzone';

export default function FileDropzone({ accept, fileName, onFile, disabled = false }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: false,
    disabled,
    onDrop: (files) => onFile(files[0]),
  });

  return <div {...getRootProps()} className={`publish-file-drop ${isDragActive ? 'is-dragging' : ''} ${fileName ? 'has-file' : ''}`}>
    <input {...getInputProps()} />
    <span className="publish-file-icon">↑</span>
    <strong>{fileName || (isDragActive ? 'Drop your file here' : 'Drop your file here')}</strong>
    <small>or choose a file from your device</small>
  </div>;
}
