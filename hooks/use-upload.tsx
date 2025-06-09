import { useCallback } from "react"

export const useUpload = () => {
  const folder = import.meta.env.PUBLIC_ENV__UPLOAD_FOLDER || 'uploads'

  const apiUpload = `${
    import.meta.env.PUBLIC_ENV__API_HOST || ''
  }api/sp/file?folder=${folder}&unique=1`

  const apiDelete = `${
    import.meta.env.PUBLIC_ENV__API_HOST || ''
  }api/sp/file?folder=${folder}&name=`

  const apiGet = `${
    import.meta.env.PUBLIC_ENV__API_HOST || ''
  }api/sp/file?folder=${folder}&name=`



  const responseParser = useCallback((response: Record<string, unknown>) => {
    const name = response["Name"] as string
    return `${apiGet}${name}`
  }, [apiGet])

  const onDelete = useCallback((file: string) => {
    const name = file.split("/").pop()
    const url = `${apiDelete}${name}`
    return fetch(url, { method: "DELETE" })
  }, [apiDelete])

  return {
    url: apiUpload,
    onDelete,
    responseParser,
  }
}

export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (percentage: number) => void,
  name = "file",
): Promise<Record<string, unknown>> {
  return await new Promise<Record<string, unknown>>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    if (onProgress) onProgress(0)
    xhr.open("POST", url)

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText) as Record<string, unknown>
      resolve(resp)
    }
    xhr.onerror = (evt) => {
      reject(evt)
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && !!onProgress) {
        const percentage = (event.loaded / event.total) * 100
        onProgress(Math.round(percentage))
      }
    }

    const formData = new FormData()
    formData.append(name, file)

    xhr.send(formData)
  })
}
