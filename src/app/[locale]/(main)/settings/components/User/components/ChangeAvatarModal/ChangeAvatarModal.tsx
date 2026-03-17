'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Avatar, Button, Icon, Loader, Modal } from '@/src/core/components';
import { useAlert } from '@/src/core/context';
import { deleteAvatarService, uploadAvatarService } from '@/src/core/services';
import {
  captureVideoFrameAsDataUrl,
  getWebcamStream,
  openCameraAndCaptureImage,
  openFilePickerForImage,
  readImageAsDataUrl,
  stopMediaStream,
} from '@/src/core/utils';

import { ChangeAvatarModalStyles } from './ChangeAvatarModal.styles';

type ChangeAvatarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fullName?: string | null;
  avatarUrl?: string | null;
  onAvatarUploaded?: () => void;
};

export const ChangeAvatarModal = ({
  isOpen,
  onClose,
  fullName,
  avatarUrl,
  onAvatarUploaded,
}: ChangeAvatarModalProps) => {
  const styles = ChangeAvatarModalStyles;
  const buttons = useTranslations('button');
  const errors = useTranslations('errors');
  const { showAlert } = useAlert();
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    avatarUrl ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const uploadNewAvatar = async (dataUrl: string) => {
    setIsUploading(true);
    const result = await uploadAvatarService(dataUrl);
    setIsUploading(false);
    if (result.success && result.data) {
      setPreviewSrc(result.data.avatarUrl);
      onAvatarUploaded?.();
    } else if (!result.success && result.message) {
      showAlert({
        variant: 'error',
        title: errors('userSavedError.title'),
        description: result.message,
      });
    }
  };

  const handleDeleteAvatar = async () => {
    setIsDeleting(true);
    const result = await deleteAvatarService();
    setIsDeleting(false);
    if (result.success) {
      setPreviewSrc(null);
      onAvatarUploaded?.();
    } else if (result.message) {
      showAlert({
        variant: 'error',
        title: errors('userSavedError.title'),
        description: result.message,
      });
    }
  };

  const stopWebcam = () => {
    stopMediaStream(webcamStream);
    setWebcamStream(null);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsWebcamMode(false);
      stopWebcam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isWebcamMode || !webcamStream) return;
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = webcamStream;

    const play = async () => {
      try {
        await video.play();
      } catch {}
    };

    void play();

    return () => {
      if (video.srcObject) video.srcObject = null;
    };
  }, [isWebcamMode, webcamStream]);

  const handleOpenWebcam = async () => {
    setIsWebcamMode(true);

    try {
      const stream = await getWebcamStream('user');
      setWebcamStream(stream);
    } catch {
      setIsWebcamMode(false);
      const file = await openCameraAndCaptureImage('user');
      if (!file) return;

      const dataUrl = await readImageAsDataUrl(file);
      if (dataUrl) {
        setPreviewSrc(dataUrl);
        void uploadNewAvatar(dataUrl);
      }
    }
  };

  const handleCaptureFromWebcam = () => {
    const video = videoRef.current;
    if (!video) return;

    const dataUrl = captureVideoFrameAsDataUrl(video, 'image/png');
    if (dataUrl) {
      setPreviewSrc(dataUrl);
      void uploadNewAvatar(dataUrl);
    }

    setIsWebcamMode(false);
    stopWebcam();
  };

  const handleCancelWebcam = () => {
    setIsWebcamMode(false);
    stopWebcam();
  };

  const handleFromDevice = async () => {
    const file = await openFilePickerForImage();
    if (!file) return;

    const dataUrl = await readImageAsDataUrl(file);
    if (dataUrl) {
      setPreviewSrc(dataUrl);
      void uploadNewAvatar(dataUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsWebcamMode(false);
        stopWebcam();
        onClose();
      }}
      variant="fixed"
    >
      <div className={styles.component}>
        <div className={styles.avatarWrapper}>
          {isWebcamMode ? (
            <div className={styles.livePreview}>
              <video
                ref={videoRef}
                className={styles.livePreview_video}
                playsInline
                muted
                autoPlay
              />
            </div>
          ) : (
            <div className={styles.avatarWithLoader}>
              <Avatar src={previewSrc} alt={fullName || 'Avatar'} size="xl" />
              {(isUploading || isDeleting) && (
                <div className={styles.avatarLoader}>
                  <Loader />
                </div>
              )}
            </div>
          )}
          {fullName && <p className={styles.avatarName}>{fullName}</p>}
        </div>

        {isWebcamMode && (
          <div className={styles.captureActions}>
            <Button
              color="blue"
              className={styles.captureBtn}
              onClick={handleCaptureFromWebcam}
              type="button"
            >
              {buttons('capturePhoto')}
            </Button>
            <Button
              color="transparent"
              className={styles.captureBtn}
              onClick={handleCancelWebcam}
              type="button"
            >
              {buttons('cancel')}
            </Button>
          </div>
        )}

        <div className={styles.buttons}>
          <Button
            color="transparent"
            className={styles.button}
            onClick={handleOpenWebcam}
            disabled={isWebcamMode || isDeleting}
            type="button"
          >
            <Icon name="camera" className={styles.button_icon} />
            <span>{buttons('takePhoto')}</span>
          </Button>

          <Button
            color="transparent"
            className={styles.button}
            onClick={handleFromDevice}
            disabled={isWebcamMode || isDeleting}
            type="button"
          >
            <Icon name="attach" className={styles.button_icon} />
            <span>{buttons('uploadFromDevice')}</span>
          </Button>
        </div>

        <Button
          color="red"
          className={styles.deleteBtn}
          onClick={handleDeleteAvatar}
          disabled={!previewSrc || isUploading || isDeleting}
          type="button"
        >
          {buttons('deleteAvatar')}
        </Button>
      </div>
    </Modal>
  );
};
