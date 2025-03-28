import { Meta, StoryObj } from '@storybook/react';
import MetadataViewer, { MetadataViewerProps } from '../components/MetadataViewer';

const meta: Meta<typeof MetadataViewer> = {
  title: 'Components/MetadataViewer',
  component: MetadataViewer,
  tags: ['autodocs'],
  argTypes: {
    metadata: {
      control: 'object',
      description: 'Metadata object to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Title text to display above the metadata',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no metadata is available',
    },
    borderStyle: {
      control: 'select',
      options: ['solid', 'dashed', 'none'],
      description: 'Style of the border around the metadata',
    },
    showTitle: {
      control: 'boolean',
      description: 'Whether to show the title',
    },
    compact: {
      control: 'boolean',
      description: 'Display metadata in compact format',
    },
    allowCopy: {
      control: 'boolean',
      description: 'Whether to show the copy button',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetadataViewer>;

const sampleMetadata = {
  id: '123',
  name: 'Sample Metadata',
  attributes: {
    color: 'blue',
    size: 'medium',
  },
  tags: ['sample', 'test', 'metadata'],
};

export const Default: Story = {
  args: {
    metadata: sampleMetadata,
  },
};

export const NoMetadata: Story = {
  args: {
    metadata: null,
    emptyMessage: 'Custom empty message',
  },
};

export const CustomTitle: Story = {
  args: {
    metadata: sampleMetadata,
    title: 'Custom Metadata Title',
  },
};

export const CompactView: Story = {
  args: {
    metadata: sampleMetadata,
    compact: true,
    borderStyle: 'solid',
  },
};

export const NoTitle: Story = {
  args: {
    metadata: sampleMetadata,
    showTitle: false,
  },
};

export const BorderStyles: Story = {
  render: function BorderStylesStory() {
    const borderStyles: MetadataViewerProps['borderStyle'][] = ['solid', 'dashed', 'none'];
    
    return (
      <div className="grid grid-cols-2 gap-4">
        {borderStyles.map((style) => (
          <div key={style || 'none'}>
            <MetadataViewer
              metadata={sampleMetadata}
              title={`Border Style: ${style || 'none'}`}
              borderStyle={style}
              compact={true}
            />
          </div>
        ))}
      </div>
    );
  }
};

export const WithoutCopyButton: Story = {
  args: {
    metadata: sampleMetadata,
    allowCopy: false,
  },
};
