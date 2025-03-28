import { FC } from 'react';
import { Clipboard } from 'flowbite-react';

export interface MetadataViewerProps {
  metadata: Record<string, any> | null | undefined;
  className?: string;
  title?: string;
  emptyMessage?: string;
  borderStyle?: 'solid' | 'dashed' | 'none';
  showTitle?: boolean;
  compact?: boolean;
  allowCopy?: boolean;
}

const MetadataViewer: FC<MetadataViewerProps> = ({
  metadata,
  className = '',
  title = 'Metadata',
  emptyMessage = 'No metadata available',
  borderStyle = 'dashed',
  showTitle = true,
  compact = false,
  allowCopy = true,
}) => {
  const borderClass = `border-${borderStyle} border-gray-300 dark:border-gray-600`;
  const formattedJson = metadata
    ? JSON.stringify(metadata, null, compact ? 0 : 2)
    : '';

  return (
    <div className={`space-y-2 ${className}`}>
      {showTitle && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h2>
      )}
      <div
        className={`border ${borderClass} rounded-lg ${compact ? 'p-2' : 'p-4'}`}
      >
        {metadata && Object.keys(metadata).length > 0 ? (
          <div className="relative">
            {allowCopy && (
              <Clipboard.WithIcon
                valueToCopy={formattedJson}
                className="absolute top-2.5 right-0"
              />
            )}
            <pre
              className={`text-sm text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-words max-w-full ${allowCopy ? 'pr-2' : ''}`}
            >
              {formattedJson}
            </pre>
          </div>
        ) : (
          <pre className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {emptyMessage}
          </pre>
        )}
      </div>
    </div>
  );
};

export default MetadataViewer;
