import { useEffect, useState } from 'react';

export function useLocalCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (disposed) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        setStream(mediaStream);
        setLoading(false);
      } catch (err) {
        if (disposed) return;

        let message = '无法访问摄像头，请检查设备连接和权限设置';
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            message = '摄像头权限被拒绝，请在浏览器设置中允许访问摄像头';
          } else if (err.name === 'NotFoundError') {
            message = '未检测到摄像头设备，请确认摄像头已正确连接';
          } else if (err.name === 'NotReadableError') {
            message = '摄像头被其他程序占用，请关闭其他使用摄像头的应用后重试';
          }
        }

        setError(message);
        setLoading(false);
      }
    }

    void startCamera();

    return () => {
      disposed = true;
      setStream((prev) => {
        if (prev) {
          prev.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
    };
  }, []);

  return { stream, loading, error };
}
