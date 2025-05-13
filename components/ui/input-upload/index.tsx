import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone-esm"
import  cn  from "@/components/utils/cn"
import {
  FileImageIcon,
  FileTextIcon,
  UploadIcon,
  TrashIcon,
} from "lucide-react"

import {
  type DropzoneProps as _DropzoneProps,
  type DropzoneState as _DropzoneState,
} from "react-dropzone-esm"
import { uploadFile, useUpload } from "@/hooks/use-upload"

export interface DropzoneState extends _DropzoneState {}

export interface DropzoneProps
  extends Omit<_DropzoneProps, "children" | "onDrop"> {
  containerClassName?: string
  dropZoneClassName?: string
  children?: (dropzone: DropzoneState) => React.ReactNode
  value?: string[]
  onChange?: (value: string[]) => void
  readOnly?: boolean
  preview?: boolean
}

export type FileItemProps = {
  href: string
  onDelete: (...args: any) => void
  disabled?: boolean
  preview?: boolean
}

export const FileItem = ({
  href,
  onDelete,
  disabled = false,
  preview = false,
}: FileItemProps) => {
  const url = new URL(href)
  const name =
    url.searchParams.get("name") || (href || "").split("/").pop() || "Untitled"
  const ext = name.split(".").pop() || ""
  const type = ["jpg", "jpeg", "gif", "png", "webp"].includes(ext)
    ? "image"
    : "file"
  const Icon = type.includes("image") ? FileImageIcon : FileTextIcon
  href = preview ? href.replace("/sp/file", "/sp/preview") : href

  return (
    <div
      className={cn(
        "border-input relative flex h-32 w-32 flex-row rounded-lg border-2 border-solid shadow-xs",
        disabled ? "bg-muted" : "bg-background",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start space-y-2",
          disabled ? "bg-muted" : "",
        )}
      >
        <Icon className={"text-primary h-10 w-10 pt-2 pl-2"} />
        <div className="flex flex-col gap-0 px-2">
          <a href={href} target="_blank">
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
  )
}

export const InputUpload = ({
  containerClassName,
  dropZoneClassName = "upload",
  children,
  value,
  onChange,
  readOnly,
  preview = true,
  ...props
}: DropzoneProps) => {
  // State:
  const [progress, setProgress] = useState(0)
  const [info, setInfo] = useState("")
  const [files, setFiles] = useState<string[]>(
    value ? (Array.isArray(value) ? value : []) : [],
  )
  const display = useMemo(
    () => (value ? (Array.isArray(value) ? value : []) : []),
    [value],
  )

  const { url, onDelete, responseParser } = useUpload()
  const onDrop = useCallback(
    async (files: File[]) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setInfo(`${i + 1} of ${files.length}`)
        if (url) {
          const resp = await uploadFile(url, file, setProgress)
          const uploaded = responseParser(resp)
          console.log("upload", uploaded)
          setFiles((files) => [...files, uploaded])
          setProgress(0)
        }

        if (i + 1 === files.length) {
          setInfo("")
        }
      }
    },
    [setFiles],
  )

  console.log("files", files)

  const onRemove = useCallback(
    async (file: string) => {
      if (onDelete) {
        await onDelete(file)
      }
      const updated = files.filter((v) => !v.includes(file))
      setFiles(updated)
    },
    [files, setFiles],
  )

  useEffect(() => {
    if (onChange) onChange(files)
  }, [files])

  const dropzone = useDropzone({
    ...props,
    onDrop,
  })

  // Return:
  return (
    <div className={cn("flex flex-row flex-wrap gap-2", containerClassName)}>
      {!readOnly && (
        <div
          {...dropzone.getRootProps()}
          className={cn(
            "border-input bg-background hover:bg-accent hover:text-accent-foreground relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all select-none",
            dropZoneClassName,
          )}
        >
          <input {...dropzone.getInputProps()} />
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex flex-col items-center gap-0.5 text-sm font-medium">
              <UploadIcon
                className={cn(
                  "mb-2 h-6 w-6",
                  progress == 0 ? "" : "animate-bounce",
                )}
              />
              <span>{progress == 0 ? "Upload files" : `${progress} %`}</span>
            </div>
          </div>
          <span className="absolute top-0 right-1 text-xs">{info}</span>
        </div>
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
  )
}
