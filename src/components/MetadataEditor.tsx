import { FC, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
} from "flowbite-react";
import { Copy, Check, Edit, Trash2 } from "lucide-react";

export interface MetadataEditorProps {
  metadata: Record<string, string> | null | undefined;
  isLoading?: boolean;
  onMetadataChange?: (metadata: Record<string, string>) => void;
  showEditButton?: boolean;
  showCopyButton?: boolean;
  showCopyValueButton?: boolean;
  title?: string;
  className?: string;
}

interface MetadataItem {
  key: string;
  value: string;
}

const MetadataEditor: FC<MetadataEditorProps> = ({
  metadata,
  isLoading = false,
  onMetadataChange,
  showEditButton = true,
  showCopyButton = true,
  showCopyValueButton = true,
  title = "Metadata",
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState<MetadataItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedMetadataJson, setCopiedMetadataJson] = useState(false);
  const [copiedMetadataValues, setCopiedMetadataValues] = useState<Set<string>>(
    new Set()
  );

  const handleOpenModal = () => {
    if (metadata) {
      setEditedMetadata(
        Object.entries(metadata).map(([key, value]) => ({
          key,
          value,
        }))
      );
    } else {
      setEditedMetadata([{ key: "", value: "" }]);
    }
    setIsModalOpen(true);
  };

  const handleAddMetadataItem = () => {
    setEditedMetadata([...editedMetadata, { key: "", value: "" }]);
  };

  const handleRemoveMetadataItem = (index: number) => {
    setEditedMetadata(editedMetadata.filter((_, i) => i !== index));
  };

  const handleMetadataKeyChange = (index: number, key: string) => {
    const newMetadata = [...editedMetadata];
    newMetadata[index].key = key;
    setEditedMetadata(newMetadata);
  };

  const handleMetadataValueChange = (index: number, value: string) => {
    const newMetadata = [...editedMetadata];
    newMetadata[index].value = value;
    setEditedMetadata(newMetadata);
  };

  const handleSaveMetadata = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newMetadata: Record<string, string> = {};
      editedMetadata.forEach((item) => {
        if (item.key.trim()) {
          newMetadata[item.key.trim()] = item.value;
        }
      });
      if (onMetadataChange) {
        onMetadataChange(newMetadata);
      }
      setIsSaving(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleCopyMetadataJson = async () => {
    if (!metadata) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopiedMetadataJson(true);
      setTimeout(() => setCopiedMetadataJson(false), 2000);
    } catch (error) {
      console.error("Failed to copy metadata:", error);
    }
  };

  const handleCopyMetadataValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedMetadataValues((prev) => new Set([...prev, key]));
      setTimeout(() => {
        setCopiedMetadataValues((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy value:", error);
    }
  };

  const hasMetadata = metadata && Object.keys(metadata).length > 0;

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            {showEditButton && (
              <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasMetadata) {
    return (
      <>
        <div className={className}>
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            {showEditButton && (
              <Button
                color="gray"
                size="xs"
                onClick={handleOpenModal}
                title="Edit metadata"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No metadata available
          </p>
        </div>

        <Modal
          dismissible
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="xl"
        >
          <ModalHeader>Edit Metadata</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {editedMetadata.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <TextInput
                      type="text"
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) =>
                        handleMetadataKeyChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <TextInput
                      type="text"
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) =>
                        handleMetadataValueChange(index, e.target.value)
                      }
                    />
                  </div>
                  <Button
                    color="gray"
                    size="sm"
                    onClick={() => handleRemoveMetadataItem(index)}
                    className="mt-0.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                color="light"
                onClick={handleAddMetadataItem}
                className="w-full"
              >
                + Add another item
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button color="gray" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMetadata} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className={className}>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <div className="flex gap-2">
            {showCopyButton && (
              <Button
                color="gray"
                size="xs"
                onClick={handleCopyMetadataJson}
                title="Copy metadata as JSON"
              >
                {copiedMetadataJson ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
            {showEditButton && (
              <Button
                color="gray"
                size="xs"
                onClick={handleOpenModal}
                title="Edit metadata"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              <div className="group relative">
                <p
                  className={`text-sm text-gray-800 dark:text-gray-200 break-words ${
                    showCopyValueButton ? "pr-8" : ""
                  }`}
                >
                  {value}
                </p>
                {showCopyValueButton && (
                  <button
                    onClick={() => handleCopyMetadataValue(key, value)}
                    className="absolute right-0 top-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    title={`Copy ${key.replace(/_/g, " ")}`}
                  >
                    {copiedMetadataValues.has(key) ? (
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        dismissible
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <ModalHeader>Edit Metadata</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {editedMetadata.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <TextInput
                    type="text"
                    placeholder="Key"
                    value={item.key}
                    onChange={(e) =>
                      handleMetadataKeyChange(index, e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    type="text"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) =>
                      handleMetadataValueChange(index, e.target.value)
                    }
                  />
                </div>
                <Button
                  color="gray"
                  size="sm"
                  onClick={() => handleRemoveMetadataItem(index)}
                  className="mt-0.5"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              color="light"
              onClick={handleAddMetadataItem}
              className="w-full"
            >
              + Add another item
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button color="gray" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetadata} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MetadataEditor;
