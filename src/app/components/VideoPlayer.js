
const VideoPlayer = ({ videoSrc }) => {
  return (
    <div className="container mx-auto p-4">
      <video controls src={videoSrc} className="w-full"></video>
    </div>
  );
};

export default VideoPlayer;
