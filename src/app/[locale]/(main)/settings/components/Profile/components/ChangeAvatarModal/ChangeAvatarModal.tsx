'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Avatar, Button, Icon, Modal } from '@/src/core/components';
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
};

export const ChangeAvatarModal = ({
  isOpen,
  onClose,
  fullName,
  avatarUrl,
}: ChangeAvatarModalProps) => {
  const styles = ChangeAvatarModalStyles;
  const buttons = useTranslations('button');
  const [previewSrc, setPreviewSrc] = useState<string | null>(avatarUrl ?? null);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      } catch {
      }
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
      if (dataUrl) setPreviewSrc(dataUrl);
    }
  };

  const handleCaptureFromWebcam = () => {
    const video = videoRef.current;
    if (!video) return;

    const dataUrl = captureVideoFrameAsDataUrl(video, 'image/png');
    if (dataUrl) {
      setPreviewSrc(dataUrl);
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
            <Avatar
              src={previewSrc}
              alt={fullName || 'Avatar'}
              size="xl"
            />
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
            disabled={isWebcamMode}
            type="button"
          >
            <Icon name="camera" className={styles.button_icon} />
            <span>{buttons('takePhoto')}</span>
          </Button>

          <Button
            color="transparent"
            className={styles.button}
            onClick={handleFromDevice}
            disabled={isWebcamMode}
            type="button"
          >
            <Icon name="attach" className={styles.button_icon} />
            <span>{buttons('uploadFromDevice')}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};


