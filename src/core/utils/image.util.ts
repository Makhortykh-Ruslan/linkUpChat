export const openCameraAndCaptureImage = async (
  capture: 'environment' | 'user' = 'environment',
): Promise<File | null> => {
  if (typeof window === 'undefined') return null;

  return new Promise<File | null>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*;capture=camera';
    input.setAttribute('capture', capture);

    const handleChange = () => {
      const file = input.files?.[0] ?? null;
      cleanup();
      resolve(file);
    };

    const handleCancel = () => {
      cleanup();
      resolve(null);
    };

    const cleanup = () => {
      input.removeEventListener('change', handleChange);
      input.removeEventListener('cancel', handleCancel as EventListener);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.addEventListener('change', handleChange);
    input.addEventListener('cancel', handleCancel as EventListener);

    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.click();
  });
};

export const getWebcamStream = async (
  facingMode: 'user' | 'environment' = 'user',
): Promise<MediaStream> => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new Error('getUserMedia is not supported');
  }

  return navigator.mediaDevices.getUserMedia({
    video: { facingMode },
  });
};

export const stopMediaStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

export const captureVideoFrameAsDataUrl = (
  video: HTMLVideoElement,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality?: number,
): string | null => {
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, width, height);

  return canvas.toDataURL(type, quality);
};

export const captureImageFromWebcam = async (): Promise<string | null> => {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return null;
  }

  let stream: MediaStream | null = null;
  let video: HTMLVideoElement | null = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    });

    video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;

    video.style.position = 'fixed';
    video.style.left = '-9999px';
    video.style.top = '-9999px';
    document.body.appendChild(video);

    if (video && video.readyState < 2) {
      await new Promise<void>((resolve) => {
        video!.oncanplay = () => {
          resolve();
        };
      });
    }

    await video.play();

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const canvas = document.createElement('canvas');
    if (!video) {
      return null;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl || null;
  } catch {
    return null;
  } finally {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (video && video.parentNode) {
      video.parentNode.removeChild(video);
    }
  }
};

export const openFilePickerForImage = async (): Promise<File | null> => {
  if (typeof window === 'undefined') return null;

  return new Promise<File | null>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    const handleChange = () => {
      const file = input.files?.[0] ?? null;
      cleanup();
      resolve(file);
    };

    const handleCancel = () => {
      cleanup();
      resolve(null);
    };

    const cleanup = () => {
      input.removeEventListener('change', handleChange);
      input.removeEventListener('cancel', handleCancel as EventListener);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.addEventListener('change', handleChange);
    input.addEventListener('cancel', handleCancel as EventListener);

    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.click();
  });
};

export const readImageAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
