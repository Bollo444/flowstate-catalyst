export const VideoPlayer: React.FC<VideoProps> = ({ source, controls }) => {
  return (
    <div className="video-container">
      <VideoScreen source={source} />
      <VideoControls controls={controls} />
      <VideoProgress />
    </div>
  );
};
