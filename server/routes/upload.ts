import { Hono } from "hono";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

// Direktori untuk menyimpan file upload
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Coba buat direktori upload jika belum ada
(async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Gagal membuat direktori upload:', error);
  }
})();

const app = new Hono();

// Helper function untuk menyimpan file
async function saveFile(file: File): Promise<{
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
}> {
  const fileExtension = file.name.split('.').pop() || '';
  const filename = `${randomUUID()}.${fileExtension}`;
  const buffer = await file.arrayBuffer();
  const filePath = join(UPLOAD_DIR, filename);
  
  await writeFile(filePath, new Uint8Array(buffer));
  
  return {
    filename,
    originalName: file.name,
    size: file.size,
    type: file.type,
    path: `/uploads/${filename}`
  };
}

// Route untuk upload file tunggal
app.post("/", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, message: 'No file uploaded' }, 400);
    }
    
    // Maksimum ukuran file (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB' 
      }, 400);
    }
    
    const savedFile = await saveFile(file);
    
    return c.json({
      success: true,
      message: 'File uploaded successfully',
      file: savedFile
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return c.json({ 
      success: false, 
      message: 'Failed to process the upload' 
    }, 500);
  }
});

// Route untuk upload multiple files
app.post("/multiple", async (c) => {
  try {
    const formData = await c.req.formData();
    const files: File[] = [];
    
    // Dapatkan semua file dari formData
    formData.forEach((value) => {
      if (value instanceof File) {
        files.push(value);
      }
    });
    
    if (files.length === 0) {
      return c.json({ success: false, message: 'No files uploaded' }, 400);
    }
    
    // Maksimum ukuran file (5MB per file)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return c.json({ 
          success: false, 
          message: `File ${file.name} is too large. Maximum size is 5MB` 
        }, 400);
      }
    }
    
    // Maksimum 5 file
    const MAX_FILES = 5;
    if (files.length > MAX_FILES) {
      return c.json({ 
        success: false, 
        message: `Too many files. Maximum is ${MAX_FILES} files` 
      }, 400);
    }
    
    // Simpan semua file
    const savedFiles = await Promise.all(files.map(saveFile));
    
    return c.json({
      success: true,
      message: 'Files uploaded successfully',
      files: savedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return c.json({ 
      success: false, 
      message: 'Failed to process the upload' 
    }, 500);
  }
});

export default app;