import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useDropzone } from "react-dropzone-esm";
import cn from "@/components/utils/cn";
import {
  FileImageIcon,
  FileTextIcon,
  UploadIcon,
  TrashIcon,
  CameraIcon,
  SwitchCameraIcon,
  XIcon,
  MaximizeIcon,
} from "lucide-react";

import {
  type DropzoneProps as _DropzoneProps,
  type DropzoneState as _DropzoneState,
} from "react-dropzone-esm";
import { uploadFile, useUpload } from "@/hooks/use-upload";

export type DropzoneState = _DropzoneState;

export interface DropzoneProps
  extends Omit<_DropzoneProps, "children" | "onDrop"> {
  containerClassName?: string;
  dropZoneClassName?: string;
  children?: (dropzone: DropzoneState) => React.ReactNode;
  value?: string[];
  onChange?: (value: string[]) => void;
  readOnly?: boolean;
  preview?: boolean;
  useCamera?: boolean;
  cameraFacing?: "user" | "environment";
}

export type FileItemProps = {
  href: string;
  onDelete: (file?: string) => void;
  disabled?: boolean;
  preview?: boolean;
};

export const FileItem = ({
  href,
  onDelete,
  disabled = false,
  preview = false,
}: FileItemProps) => {
  const url = new URL(href);
  const name =
    url.searchParams.get("name") || (href || "").split("/").pop() || "Untitled";
  const ext = name.split(".").pop() || "";
  const type = ["jpg", "jpeg", "gif", "png", "webp"].includes(ext)
    ? "image"
    : "file";
  const Icon = type.includes("image") ? FileImageIcon : FileTextIcon;
  href = preview ? href.replace("/sp/file", "/sp/preview") : href;

  return (
    <div
      className={cn(
        "border-input relative flex h-32 w-32 flex-row rounded-lg border-2 border-solid shadow-xs",
        disabled ? "bg-muted" : "bg-background"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start space-y-2",
          disabled ? "bg-muted" : ""
        )}
      >
        <Icon className={"text-primary h-10 w-10 pt-2 pl-2"} />
        <div className="flex flex-col gap-0 px-2">
          <a href={href} target="_blank" rel="noreferrer">
            <span className="block h-[38px] overflow-hidden text-[0.85rem] leading-snug font-medium break-all text-ellipsis">
              {name.split(".").slice(0, -1).join(".")}
            </span>
          </a>
          <div className="text-[0.7rem] leading-tight text-gray-500">
            .{ext}
          </div>
        </div>
      </div>
      {!disabled && (
        <div
          className="border-input bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground absolute top-0 right-0 -mt-2 -mr-2 cursor-pointer rounded-full border-2 border-solid p-2 shadow-xs transition-all select-none"
          onClick={() => onDelete()}
        >
          <TrashIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export const InputUpload = ({
  containerClassName,
  dropZoneClassName = "upload",
  value,
  onChange,
  readOnly,
  preview = true,
  useCamera = false,
  cameraFacing = "user",
  ...props
}: DropzoneProps) => {
  // State:
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState("");
  const [files, setFiles] = useState<string[]>(
    value ? (Array.isArray(value) ? value : []) : []
  );
  const [facing, setFacing] = useState<"user" | "environment">(cameraFacing);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { url, onDelete, responseParser } = useUpload();

  const onDrop = useCallback(
    async (files: File[]) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setInfo(`${i + 1} of ${files.length}`);
        if (url) {
          //console.log("InputUpload: Uploading file:", file.name);
          const resp = await uploadFile(url, file, setProgress);
          const uploaded = responseParser(resp);
          //console.log("InputUpload: Upload response:", resp);
          //console.log("InputUpload: Parsed URL:", uploaded);
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles, uploaded];
            //console.log("InputUpload: Updated files state:", newFiles);
            return newFiles;
          });
          setProgress(0);
        }

        if (i + 1 === files.length) {
          setInfo("");
        }
      }
    },
    [setFiles, url, responseParser]
  );

  const toggleFacing = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setFacing((prev) => (prev === "user" ? "environment" : "user"));

    // Restart camera with new facing mode
    if (isCameraActive) {
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  }, [isCameraActive]);

  const onRemove = useCallback(
    async (file: string) => {
      if (onDelete) {
        await onDelete(file);
      }
      const updated = files.filter((v) => !v.includes(file));
      setFiles(updated);
    },
    [files, setFiles, onDelete]
  );

  useEffect(() => {
    if (onChange) {
      //console.log("InputUpload: Updating parent with files:", files);
      onChange(files);
    }
  }, [files, onChange]);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Start camera function
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: { facingMode: facing },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      if (fullscreenVideoRef.current) {
        fullscreenVideoRef.current.srcObject = stream;
        fullscreenVideoRef.current.play();
      }

      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Could not access the camera. Please check permissions and try again."
      );
      setIsCameraActive(false);
      setIsFullscreen(false);
    }
  }, [facing]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (isCameraActive) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setIsFullscreen(false);
    } else {
      // Start camera
      startCamera();
    }
  }, [isCameraActive, startCamera]);

  // Take photo
  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Use the active video element (either thumbnail or fullscreen)
    const video =
      isFullscreen && fullscreenVideoRef.current
        ? fullscreenVideoRef.current
        : videoRef.current;

    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        // Create file from blob
        const file = new File([blob], `photo_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Upload using existing onDrop function
        onDrop([file]);

        // Close fullscreen mode after taking photo
        if (isFullscreen) {
          setIsFullscreen(false);
        }
      },
      "image/jpeg",
      0.95
    );
  }, [onDrop, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const dropzone = useDropzone({
    ...props,
    onDrop,
    accept: { "image/*": [] },
  });

  // Return:
  return (
    <div
      className={cn("flex flex-row flex-wrap gap-2", containerClassName || "")}
    >
      {!readOnly && (
        <>
          {useCamera && (
            <>
              <div
                className={cn(
                  "border-input bg-background hover:bg-accent hover:text-accent-foreground relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all select-none",
                  dropZoneClassName,
                  isCameraActive ? "border-blue-500" : ""
                )}
                onClick={toggleCamera}
              >
                {isCameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        playsInline
                        muted
                      />
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-400 text-white rounded-full w-8 h-8 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            takePhoto();
                          }}
                        >
                          <div className="w-5 h-5 bg-white rounded-full"></div>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="absolute top-1 left-1 z-10 bg-blue-500 p-1 rounded-full hover:bg-blue-400 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                      >
                        <MaximizeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex flex-col items-center gap-0.5 text-sm font-medium">
                      <CameraIcon
                        className={cn(
                          "mb-2 h-6 w-6",
                          progress == 0 ? "" : "animate-bounce"
                        )}
                      />
                      <span className="text-xs text-center">Open Camera</span>
                    </div>
                  </div>
                )}

                {isCameraActive && (
                  <button
                    type="button"
                    className="absolute top-1 z-10 right-1 bg-red-500 p-1 rounded-full hover:bg-red-200 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFacing();
                    }}
                    title={
                      facing === "user"
                        ? "Switch to back camera"
                        : "Switch to front camera"
                    }
                  >
                    <SwitchCameraIcon className="h-4 w-4 text-white" />
                  </button>
                )}
                <span className="absolute top-0 left-1 text-xs">{info}</span>

                {/* Hidden canvas for taking snapshots */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>

              {/* Fullscreen camera modal */}
              {isFullscreen && isCameraActive && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl max-h-full bg-black rounded-lg overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        type="button"
                        className="bg-red-500 p-2 rounded-full hover:bg-red-400 text-white"
                        onClick={toggleFacing}
                        title={
                          facing === "user"
                            ? "Switch to back camera"
                            : "Switch to front camera"
                        }
                      >
                        <SwitchCameraIcon className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-white"
                        onClick={() => setIsFullscreen(false)}
                      >
                        <XIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <video
                      ref={fullscreenVideoRef}
                      className="w-full h-full object-contain"
                      playsInline
                      muted
                      autoPlay
                    />

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-400 text-white rounded-full w-16 h-16 flex items-center justify-center"
                        onClick={takePhoto}
                      >
                        <div className="w-12 h-12 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div
            {...dropzone.getRootProps()}
            className={cn(
              "border-input bg-background hover:bg-accent hover:text-accent-foreground relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all select-none",
              dropZoneClassName
            )}
          >
            <input {...dropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex flex-col items-center gap-0.5 text-sm font-medium">
                <UploadIcon
                  className={cn(
                    "mb-2 h-6 w-6",
                    progress == 0 ? "" : "animate-bounce"
                  )}
                />
                <span>{progress == 0 ? "Upload files" : `${progress} %`}</span>
              </div>
            </div>
            <span className="absolute top-0 right-1 text-xs">{info}</span>
          </div>
        </>
      )}
      {files.length > 0 &&
        files.map((file, index) => (
          <FileItem
            preview={preview}
            href={file}
            key={index}
            disabled={readOnly}
            onDelete={() => onRemove(file)}
          />
        ))}
      {files.length === 0 && readOnly && (
        <div className="border-input bg-muted flex h-10 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm">
          -
        </div>
      )}
    </div>
  );
};
