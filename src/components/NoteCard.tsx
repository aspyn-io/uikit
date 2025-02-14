import React from "react";

interface NoteCardProps {
  tags: { label: string; color: string }[];
  title: string;
  content: string;
  author: string;
  time: string;
  className?: string;
  avatar?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  tags,
  title,
  content,
  author,
  time,
  className,
  avatar,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-800 ${className}`}
    >
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs font-semibold px-2 py-1 rounded-full bg-${tag.color}-100 text-${tag.color}-700 dark:bg-${tag.color}-700 dark:text-${tag.color}-100`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {content}
        </p>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 p-4 border-t">
        <div className="flex items-center">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <span className="font-medium">{author}</span>
        </div>
        <span>{time}</span>
      </div>
    </div>
  );
};

export default NoteCard;
