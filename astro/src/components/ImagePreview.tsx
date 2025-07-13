import { useEffect, useState } from 'react';

interface Props {
  fileSelector: string; // e.g. "#image"
}

const ImagePreview = ({ fileSelector }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const input = document.querySelector(
      fileSelector,
    ) as HTMLInputElement | null;
    if (!input) return;

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
      } else {
        setPreviewUrl(null);
      }
    };

    input.addEventListener('change', handleChange);
    return () => {
      input.removeEventListener('change', handleChange);
    };
  }, [fileSelector]);

  return previewUrl ? (
    <div style={{ marginTop: '1em' }}>
      <p>プレビュー:</p>
      <img
        src={previewUrl}
        alt="preview"
        style={{ maxWidth: '300px', borderRadius: '8px' }}
      />
    </div>
  ) : null;
};

export default ImagePreview;
