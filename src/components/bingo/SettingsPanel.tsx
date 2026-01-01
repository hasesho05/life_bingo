/**
 * SettingsPanel Component
 * Panel for selecting templates and uploading background images
 * Uses Neo-Brutalism style (thick borders + hard shadows) for UI elements
 */

import { useRef } from 'react';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface SettingsPanelProps {
  selectedTemplate: string;
  backgroundImageUrl: string | null;
  onTemplateSelect: (id: string) => void;
  onImageUpload: (url: string) => void;
}

export const SettingsPanel = (props: SettingsPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        props.onImageUpload(result);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-4">
      <div className="bg-white border-3 border-black rounded-lg p-4 shadow-hard">
        <h3 className="text-lg font-bold mb-4">背景設定</h3>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-2 block">テンプレート</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => props.onTemplateSelect(template.id)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-md border-2 border-black',
                  'transition-all duration-150',
                  'hover:shadow-hard-sm',
                  props.selectedTemplate === template.id &&
                    !props.backgroundImageUrl &&
                    'ring-2 ring-electric-blue ring-offset-2 shadow-hard-sm'
                )}
                style={{ background: template.style.background }}
                title={template.name}
              >
                <span className="sr-only">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold mb-2 block">カスタム画像</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUploadClick}
              className={cn(
                'flex items-center gap-2 px-4 py-2',
                'bg-off-white border-2 border-black rounded-md',
                'font-semibold text-sm',
                'transition-all duration-150',
                'hover:shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5',
                'shadow-hard'
              )}
            >
              <Upload size={16} />
              画像をアップロード
            </button>
            {props.backgroundImageUrl && (
              <div className="w-12 h-12 rounded-md border-2 border-black overflow-hidden">
                <img
                  src={props.backgroundImageUrl}
                  alt="Uploaded background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
