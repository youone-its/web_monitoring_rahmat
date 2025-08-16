import { useState, useRef, useEffect } from "react";
import { Video, Expand, Camera, VolumeX, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function CameraFeedWidget() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState("camera-01");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle device camera for Camera 01
  useEffect(() => {
    if (selectedCamera === "camera-01") {
      setCameraError(null);
      navigator.mediaDevices.getUserMedia({ video: true, audio: !isMuted })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.srcObject = stream;
            fullscreenVideoRef.current.play();
          }
        })
        .catch(() => {
          setCameraError("Unable to access device camera.");
        });
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [selectedCamera, isMuted, isFullscreen]);

  const cameras = [
    { id: "camera-01", name: "Camera 01 - Main" },
    { id: "camera-02", name: "Camera 02 - Side" },
    { id: "camera-03", name: "Camera 03 - Rear" },
  ];

  const handleCaptureSnapshot = () => {
    if (selectedCamera === "camera-01" && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `snapshot-camera01-${new Date().toISOString()}.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
          }
        }, "image/png");
      }
    } else if (selectedCamera !== "camera-01") {
      // For other cameras, download the placeholder image
      const img = document.querySelector<HTMLImageElement>("[data-testid='camera-feed-image']");
      if (img && img.src) {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = `snapshot-${selectedCamera}-${new Date().toISOString()}.jpg`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  const videoContent = (
    <div className="video-container h-80 bg-black rounded-lg relative cursor-pointer group">
      {selectedCamera === "camera-01" ? (
        cameraError ? (
          <div className="w-full h-full flex items-center justify-center text-red-500 bg-black rounded-lg">
            {cameraError}
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            style={{ transform: "scaleX(-1)" }}
            muted={isMuted}
            autoPlay
            playsInline
            onClick={toggleFullscreen}
            data-testid="camera-feed-video"
          />
        )
      ) : (
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
          alt="Live camera feed from monitoring device"
          className="w-full h-full object-cover rounded-lg"
          onClick={toggleFullscreen}
          data-testid="camera-feed-image"
        />
      )}

      {/* Video Overlay Controls */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 text-white hover:bg-opacity-30"
            onClick={toggleFullscreen}
            data-testid="fullscreen-toggle-overlay"
          >
            <Expand className="text-2xl" size={24} />
          </Button>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full status-indicator" />
        <span data-testid="live-indicator">LIVE</span>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        <span data-testid="video-timestamp">{currentTime}</span>
      </div>
    </div>
  );

  return (
    <>
      <Card className="lg:col-span-1 overflow-hidden" data-testid="camera-feed-widget">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-secondary flex items-center space-x-2">
              <Video className="text-primary" size={20} />
              <span>Feed Kamera</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full status-indicator" />
                <span data-testid="camera-status">Recording</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 text-gray-600 hover:text-primary transition-colors duration-200"
                onClick={toggleFullscreen}
                data-testid="fullscreen-toggle-button"
              >
                <Expand size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {videoContent}

          {/* Camera Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary"
                onClick={handleCaptureSnapshot}
                data-testid="capture-snapshot-button"
              >
                <Camera size={16} />
                <span>Snapshot</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary"
                onClick={toggleAudio}
                data-testid="toggle-audio-button"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>Audio</span>
              </Button>
            </div>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger className="w-48" data-testid="camera-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recording Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Resolution:</span>
                <span className="font-medium ml-1" data-testid="camera-resolution">1920x1080</span>
              </div>
              <div>
                <span className="text-gray-600">FPS:</span>
                <span className="font-medium ml-1" data-testid="camera-fps">30</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 fullscreen-modal" data-testid="fullscreen-modal">
          <div className="relative w-full h-[90vh]">
            {selectedCamera === "camera-01" ? (
              cameraError ? (
                <div className="w-full h-full flex items-center justify-center text-red-500 bg-black rounded-lg">
                  {cameraError}
                </div>
              ) : (
                <video
                  ref={fullscreenVideoRef}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ transform: "scaleX(-1)" }}
                  muted={isMuted}
                  autoPlay
                  playsInline
                  data-testid="fullscreen-camera-feed"
                />
              )
            ) : (
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
                alt="Live camera feed in fullscreen"
                className="w-full h-full object-cover rounded-lg"
                data-testid="fullscreen-camera-feed"
              />
            )}
            {/* Fullscreen Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCaptureSnapshot}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                data-testid="fullscreen-snapshot-button"
              >
                <Camera size={16} className="mr-2" />
                Snapshot
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                data-testid="fullscreen-close-button"
              >
                Close
              </Button>
            </div>
            {/* Live Indicator in Fullscreen */}
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full status-indicator" />
              <span>LIVE</span>
            </div>
            {/* Timestamp in Fullscreen */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              <span data-testid="fullscreen-timestamp">{currentTime}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
