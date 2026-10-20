/**
 * Utility function to upload base64 images to Vercel Blob Store via the secure backend API route
 */
export async function uploadImageToVercelBlob(dataUrl: string, fileName?: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl; // Already a remote public HTTP/HTTPS URL
  }

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        fileName: fileName || 'photo',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Error uploading image to Vercel Blob Store via backend route:', err);
  }

  return dataUrl;
}
