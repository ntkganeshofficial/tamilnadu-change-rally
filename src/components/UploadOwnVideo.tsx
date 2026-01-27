import React, { useState, useRef } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

const FramedVideo = ({ scale = 1.01 }) => {
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [frameSrc, setFrameSrc] = useState<string>("/upload-own-video.png");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState<string>("");
    const [isRecording, setIsRecording] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const frameInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    const toggleVideoPlayback = () => {
        if (videoRef.current && !isRecording) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            // Disconnect old audio source if it exists
            if (audioSourceRef.current) {
                audioSourceRef.current.disconnect();
                audioSourceRef.current = null;
            }

            // Store in local storage and create object URL
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setRecordedVideoUrl(""); // Reset recorded video

            // Store file reference in sessionStorage for cleanup
            sessionStorage.setItem('uploadedVideoUrl', url);
        } else {
            alert("Please select a video file");
        }
        // Reset input value to allow re-selecting the same file
        event.target.value = '';
    };

    const handleFrameUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setFrameSrc(url);

            // Store file reference in sessionStorage for cleanup
            sessionStorage.setItem('uploadedFrameUrl', url);
        } else {
            alert("Please select an image file");
        }
    };

    // Cleanup on component unmount
    React.useEffect(() => {
        return () => {
            const videoUrl = sessionStorage.getItem('uploadedVideoUrl');
            const frameUrl = sessionStorage.getItem('uploadedFrameUrl');

            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
                sessionStorage.removeItem('uploadedVideoUrl');
            }
            if (frameUrl) {
                URL.revokeObjectURL(frameUrl);
                sessionStorage.removeItem('uploadedFrameUrl');
            }
            if (recordedVideoUrl) {
                URL.revokeObjectURL(recordedVideoUrl);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [recordedVideoUrl]);

    /* ---------------- EXPORT WITH FRAME ---------------- */

    const downloadVideo = async () => {
        if (!videoRef.current || !canvasRef.current) {
            alert("Video or canvas not ready");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);
            setIsRecording(true);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Could not get canvas context");
            }

            // Set canvas size to match video dimensions
            canvas.width = 1080;
            canvas.height = 1350;

            // Load frame image
            const frameImg = new Image();
            frameImg.crossOrigin = "anonymous";
            frameImg.src = frameSrc;
            await new Promise<void>((resolve, reject) => {
                frameImg.onload = () => resolve();
                frameImg.onerror = () => reject(new Error("Failed to load frame"));
            });

            // Stop any current playback and reset
            video.pause();
            video.loop = false; // Disable loop for recording
            video.muted = false; // Ensure video is not muted
            
            // Reset to beginning if needed
            if (video.currentTime !== 0) {
                video.currentTime = 0;
                await new Promise<void>((resolve) => {
                    const handleSeeked = () => {
                        video.removeEventListener('seeked', handleSeeked);
                        resolve();
                    };
                    video.addEventListener('seeked', handleSeeked);
                });
            }

            // Create canvas stream
            const canvasStream = canvas.captureStream(30); // 30 FPS

            // Get audio from video and merge with canvas
            let finalStream = canvasStream;

            try {
                // Clean up any existing audio context
                if (audioSourceRef.current) {
                    try {
                        audioSourceRef.current.disconnect();
                    } catch (e) {
                        console.log("Error disconnecting audio source:", e);
                    }
                    audioSourceRef.current = null;
                }

                if (audioContextRef.current) {
                    try {
                        if (audioContextRef.current.state !== 'closed') {
                            await audioContextRef.current.close();
                        }
                    } catch (e) {
                        console.log("Error closing audio context:", e);
                    }
                }
                
                // Create fresh AudioContext
                audioContextRef.current = new AudioContext();
                const audioContext = audioContextRef.current;
                
                // Resume AudioContext if suspended (required in some browsers)
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                // Create media element source
                const source = audioContext.createMediaElementSource(video);
                audioSourceRef.current = source;
                
                // Create destination for recording
                const destination = audioContext.createMediaStreamDestination();

                // Connect source to both destination (for recording) and speakers (for playback)
                source.connect(destination);
                source.connect(audioContext.destination);

                // Get audio tracks
                const audioTracks = destination.stream.getAudioTracks();
                console.log("Audio tracks captured:", audioTracks.length);
                console.log("Audio track settings:", audioTracks[0]?.getSettings());

                if (audioTracks.length > 0) {
                    // Merge canvas video with audio
                    finalStream = new MediaStream([
                        ...canvasStream.getVideoTracks(),
                        ...audioTracks
                    ]);
                    console.log("Audio successfully merged. Total tracks:", finalStream.getTracks().length);
                    console.log("Track types:", finalStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
                } else {
                    console.warn("No audio tracks found in destination stream");
                }
            } catch (e) {
                console.error("Error setting up audio:", e);
            }

            // Use WebM with Opus audio codec for better compatibility
            let mimeType = 'video/webm;codecs=vp8,opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.log("VP8+Opus not supported, trying VP9+Opus");
                mimeType = 'video/webm;codecs=vp9,opus';
            }
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.log("VP9+Opus not supported, using default WebM");
                mimeType = 'video/webm';
            }
            
            console.log("Using mime type:", mimeType);
            console.log("Source video type:", videoSrc.split('.').pop());

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(finalStream, {
                mimeType: mimeType,
                videoBitsPerSecond: 5000000,
                audioBitsPerSecond: 128000
            });

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);

                // Determine file extension based on mime type
                const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';

                // Download automatically
                const a = document.createElement("a");
                a.href = url;
                a.download = `வடிவமைப்பு-சட்டம்.${extension}`;
                a.click();

                // Reset video to loop mode
                video.loop = true;
                video.currentTime = 0;
                video.play();

                alert("Video with frame and audio downloaded successfully!");
                setLoading(false);
                setProgress(0);
                setIsRecording(false);
            };

            // Animation function to draw video + frame
            let animationId: number;
            const drawFrame = () => {
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw video frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Draw frame overlay on top
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

                // Update progress
                if (video.duration > 0) {
                    const currentProgress = Math.min(Math.round((video.currentTime / video.duration) * 100), 100);
                    setProgress(currentProgress);
                }

                if (!video.paused && !video.ended) {
                    animationId = requestAnimationFrame(drawFrame);
                }
            };

            // Prevent video from being paused during recording
            const preventPause = (e: Event) => {
                if (isRecording) {
                    e.preventDefault();
                    video.play();
                }
            };
            video.addEventListener('pause', preventPause);

            // Start recording
            mediaRecorder.start();
            console.log("Recording started");

            // Play and draw
            await video.play();
            drawFrame();

            // Stop recording when video ends
            video.onended = () => {
                console.log("Video ended, stopping recording");
                cancelAnimationFrame(animationId);
                video.removeEventListener('pause', preventPause);
                setTimeout(() => {
                    mediaRecorder.stop();
                }, 100);
            };

        } catch (err) {
            console.error("Processing error:", err);
            alert(`Processing failed: ${err instanceof Error ? err.message : String(err)}`);
            setLoading(false);
            setProgress(0);
            setIsRecording(false);

            // Reset video state
            if (videoRef.current) {
                videoRef.current.loop = true;
                videoRef.current.currentTime = 0;
                videoRef.current.play();
            }
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="px-4 md:px-0">
            <style>{`
        @media (max-width: 767px) {
          .upload-overlay-btn {
            gap: 0.41rem !important;
            padding: 0.82rem !important;
            min-width: 102px !important;
          }
          .upload-overlay-btn .icon-size {
            width: 20px !important;
            height: 20px !important;
          }
          .upload-overlay-btn .text-main {
            font-size: 0.51rem !important;
          }
          .upload-overlay-btn .text-sub {
            font-size: 0.38rem !important;
          }
          .upload-overlay-btn .text-small {
            font-size: 0.33rem !important;
          }
        }
        
        button {
          transition: all 0.3s ease;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .upload-overlay-btn:hover {
          background: #d11820 !important;
          border-color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .frame-container {
          height: 350px;
        }
        
        @media (min-width: 768px) {
          .frame-container {
            height: 685px;
          }
        }
      `}</style>
            {/* Preview */}
            <h2 className="text-2xl md:text-2xl text-white text-center text-foreground pb-6 md:pb-8">
                சட்டகத்துடன் கூடிய காணொளியை உருவாக்க
            </h2>

            <div
                className="frame-container"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "720px",
                    margin: "0 auto 1rem",
                }}
            >
                {/* Upload Button Overlay */}
                {!videoSrc && (
                    <button
                        onClick={() => videoInputRef.current?.click()}
                        className="upload-overlay-btn"
                        style={{
                            position: "absolute",
                            top: "45%",
                            left: "40%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.8rem",
                            color: "white",
                            padding: "1.6rem",
                            border: "3px dashed rgba(255, 255, 255, 0.5)",
                            borderRadius: "8px",
                            minWidth: "200px",
                            background: "#ed1c24",
                            zIndex: 10,
                            cursor: "pointer",
                        }}
                    >
                        <Upload className="icon-size" size={38} />
                        <div className="text-main" style={{ textAlign: "center", fontSize: "1rem", fontWeight: "600" }}>
                            உங்களது<br />காணொளியை<br />பதிவேற்ற
                        </div>
                        <div className="text-sub" style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                            இங்கே சொடுக்கவும்<br />
                            அல்லது காணொளியை<br />
                            இழுத்து விடவும்
                        </div>
                        <div className="text-small" style={{ fontSize: "0.65rem", opacity: 0.6 }}>
                            (அதிகபட்சம் 100MB)
                        </div>
                    </button>
                )}
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    hidden
                />

                <video
                    ref={videoRef}
                    src={videoSrc}
                    autoPlay
                    loop
                    playsInline
                    onClick={toggleVideoPlayback}
                    style={{
                        position: "absolute",
                        top: "45%",
                        left: "45%",
                        width: "60%",
                        height: "75%",
                        objectFit: "cover",
                        transform: `translate(-50%, -50%) scale(${scale})`,
                        zIndex: 1,
                        cursor: videoSrc && !isRecording ? "pointer" : "default",
                    }}
                />

                <img
                    src={frameSrc}
                    alt="Frame"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "75%",
                        height: "auto",
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                />

                {/* Re-upload button when video is loaded */}
                {videoSrc && (
                    <button
                        onClick={() => videoInputRef.current?.click()}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "white",
                            padding: "0.5rem 1rem",
                            background: "rgba(0, 0, 0, 0.7)",
                            border: "2px solid rgba(255, 255, 255, 0.5)",
                            borderRadius: "8px",
                            zIndex: 20,
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        <Upload size={16} /> காணொளி மாற்ற
                    </button>
                )}

                {/* Hidden canvas for recording */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Other Controls */}
            <div
                className="flex flex-row gap-4 justify-center mb-4"
            >
                <button
                    onClick={downloadVideo}
                    disabled={loading || !videoSrc}
                    className="md:w-80 px-3 md:px-6 py-2 md:py-3 bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-fredoka text-xs md:text-base flex items-center justify-center gap-2 md:whitespace-nowrap"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            காத்திருக்கவும்... {progress}%
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            பதிவிறக்கவும்
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FramedVideo;
