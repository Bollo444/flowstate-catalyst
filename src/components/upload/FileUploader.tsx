export const FileUploader: React.FC<UploaderProps> = ({
  accept,
  multiple,
  onUpload,
}) => {
  return (
    <div className="uploader-container">
      <UploadZone accept={accept} multiple={multiple} />
      <UploadProgress onUpload={onUpload} />
    </div>
  );
};
