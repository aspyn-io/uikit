import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./ThemeProvider";
import {
  Alert,
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const meta: Meta = {
  title: "Theme/Grayscale Theme",
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Overview
The Grayscale Theme is a monochromatic variant of the default Flowbite theme, replacing the blue color palette with grayscale colors. This theme provides a clean, professional look while maintaining the same component structure and functionality.

### Usage
To use the Grayscale Theme in your application:

\`\`\`jsx
import { ThemeProvider } from '@aspyn-io/uikit';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
\`\`\`

### Theme Colors
The theme uses a grayscale color palette that maps to the following semantic colors:

- Primary: gray-700
- Secondary: gray-200
- Background: gray-50
- Text: gray-900
- Text Secondary: gray-600
- Border: gray-200

### Dark Mode
The theme supports dark mode with appropriate color adjustments for better contrast and readability.

### Component Usage
When using components, you can apply the grayscale theme by using the \`color="gray"\` prop:

\`\`\`jsx
<Button color="gray">Primary Button</Button>
<Alert color="gray">Info Alert</Alert>
<Badge color="gray">Status</Badge>
\`\`\`

### Benefits
- Consistent monochromatic design
- Professional and clean appearance
- Easy integration with existing Flowbite components
- Full dark mode support
- Maintains accessibility standards
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Theme Comparison Layout Component
const ThemeComparison = ({
  defaultContent,
  grayscaleContent,
}: {
  defaultContent: React.ReactNode;
  grayscaleContent: React.ReactNode;
}) => (
  <div className="grid grid-cols-2 gap-8">
    <div>
      <h3 className="text-lg font-semibold mb-4">Default Theme</h3>
      {defaultContent}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-4">Grayscale Theme</h3>
      {grayscaleContent}
    </div>
  </div>
);

// Button Stories
export const Buttons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Button Variants
The grayscale theme supports all button variants:

- Primary: Solid background with white text
- Outline: Transparent background with border

\`\`\`jsx
<Button color="gray">Primary</Button>
<Button color="gray" outline>Outline</Button>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <ThemeComparison
        defaultContent={
          <div className="flex flex-wrap gap-4">
            <Button className="w-32">Primary</Button>
            <Button className="w-32 bg-gradient-to-br from-purple-500 to-blue-500">
              Gradient
            </Button>
            <Button className="w-32" outline>
              Outline
            </Button>
          </div>
        }
        grayscaleContent={
          <div className="flex flex-wrap gap-4">
            <Button color="gray" className="w-32">
              Primary
            </Button>
            <Button
              color="gray"
              className="w-32 bg-gradient-to-br from-gray-400 to-gray-700"
            >
              Gradient
            </Button>
            <Button color="gray" className="w-32" outline>
              Outline
            </Button>
          </div>
        }
      />
    </div>
  ),
};

// Card Story
export const CardExample: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Card Components
Cards in the grayscale theme maintain the same structure but use grayscale colors for borders, backgrounds, and text.

\`\`\`jsx
<Card>
  <h5>Card Title</h5>
  <p>Card content</p>
  <Button color="gray">Action</Button>
</Card>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <ThemeComparison
        defaultContent={
          <Card className="max-w-sm">
            <h5 className="text-2xl font-bold tracking-tight">Card Title</h5>
            <p className="font-normal">
              This card demonstrates the theme styling.
            </p>
            <Button className="mt-4">Read more</Button>
          </Card>
        }
        grayscaleContent={
          <Card className="max-w-sm">
            <h5 className="text-2xl font-bold tracking-tight">Card Title</h5>
            <p className="font-normal">
              This card demonstrates the theme styling.
            </p>
            <Button color="gray" className="mt-4">
              Read more
            </Button>
          </Card>
        }
      />
    </div>
  ),
};

// Alert Story
export const Alerts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Alert Components
Alerts use grayscale colors for backgrounds, borders, and text while maintaining the same structure and functionality.

\`\`\`jsx
<Alert color="gray">
  <span>Info alert!</span>
  Alert content
</Alert>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <ThemeComparison
        defaultContent={
          <div className="flex flex-col gap-4">
            <Alert className="w-96">
              <span className="font-medium">Info alert!</span> This is an alert.
            </Alert>
            <Alert className="w-96" withBorderAccent>
              <span className="font-medium">Info alert!</span> This is an alert
              with border accent.
            </Alert>
          </div>
        }
        grayscaleContent={
          <div className="flex flex-col gap-4">
            <Alert color="gray" className="w-96">
              <span className="font-medium">Info alert!</span> This is an alert.
            </Alert>
            <Alert color="gray" className="w-96" withBorderAccent>
              <span className="font-medium">Info alert!</span> This is an alert
              with border accent.
            </Alert>
          </div>
        }
      />
    </div>
  ),
};

// Badge Story
export const Badges: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Badge Components
Badges are available in different sizes and use grayscale colors for consistent styling.

\`\`\`jsx
<Badge color="gray">Default</Badge>
<Badge color="gray" size="sm">Small</Badge>
<Badge color="gray" size="lg">Large</Badge>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <ThemeComparison
        defaultContent={
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge size="sm">Small</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        }
        grayscaleContent={
          <div className="flex flex-wrap gap-2">
            <Badge color="gray">Default</Badge>
            <Badge color="gray" size="sm">
              Small
            </Badge>
            <Badge color="gray" size="lg">
              Large
            </Badge>
          </div>
        }
      />
    </div>
  ),
};

// Table Story
export const TableExample: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Table Components
Tables use grayscale colors for borders, backgrounds, and text while maintaining the same structure and functionality.

\`\`\`jsx
<Table>
  <Table.Head>
    <Table.HeadCell>Header</Table.HeadCell>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Content</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <ThemeComparison
        defaultContent={
          <div className="w-full max-w-2xl">
            <Table>
              <TableHead>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>2024-03-20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Badge>Pending</Badge>
                  </TableCell>
                  <TableCell>2024-03-19</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        }
        grayscaleContent={
          <div className="w-full max-w-2xl">
            <Table>
              <TableHead>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge color="gray">Active</Badge>
                  </TableCell>
                  <TableCell>2024-03-20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Badge color="gray">Pending</Badge>
                  </TableCell>
                  <TableCell>2024-03-19</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        }
      />
    </div>
  ),
};

// Color Palette Story
export const ColorPalette: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Color Palette
The grayscale theme uses a comprehensive grayscale color palette that maps to the default theme's blue colors:

| Default Theme | Grayscale Theme |
|--------------|-----------------|
| blue-50      | gray-50         |
| blue-100     | gray-100        |
| blue-200     | gray-200        |
| blue-300     | gray-300        |
| blue-400     | gray-400        |
| blue-500     | gray-500        |
| blue-600     | gray-600        |
| blue-700     | gray-700        |
| blue-800     | gray-800        |
| blue-900     | gray-900        |

These colors can be used directly in your components or through the theme's semantic color tokens.
`,
      },
    },
  },
  render: () => (
    <ThemeComparison
      defaultContent={
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Theme Colors</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-lg mb-2"></div>
              <span className="text-sm">blue-50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-lg mb-2"></div>
              <span className="text-sm">blue-100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-200 rounded-lg mb-2"></div>
              <span className="text-sm">blue-200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-300 rounded-lg mb-2"></div>
              <span className="text-sm">blue-300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-400 rounded-lg mb-2"></div>
              <span className="text-sm">blue-400</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-lg mb-2"></div>
              <span className="text-sm">blue-500</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg mb-2"></div>
              <span className="text-sm">blue-600</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-700 rounded-lg mb-2"></div>
              <span className="text-sm">blue-700</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-800 rounded-lg mb-2"></div>
              <span className="text-sm">blue-800</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-900 rounded-lg mb-2"></div>
              <span className="text-sm">blue-900</span>
            </div>
          </div>
        </div>
      }
      grayscaleContent={
        <div>
          <h3 className="text-lg font-semibold mb-4">Grayscale Theme Colors</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-lg mb-2"></div>
              <span className="text-sm">gray-50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg mb-2"></div>
              <span className="text-sm">gray-100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mb-2"></div>
              <span className="text-sm">gray-200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-lg mb-2"></div>
              <span className="text-sm">gray-300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-400 rounded-lg mb-2"></div>
              <span className="text-sm">gray-400</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-500 rounded-lg mb-2"></div>
              <span className="text-sm">gray-500</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-600 rounded-lg mb-2"></div>
              <span className="text-sm">gray-600</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-700 rounded-lg mb-2"></div>
              <span className="text-sm">gray-700</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800 rounded-lg mb-2"></div>
              <span className="text-sm">gray-800</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-900 rounded-lg mb-2"></div>
              <span className="text-sm">gray-900</span>
            </div>
          </div>
        </div>
      }
    />
  ),
};

// Dark Mode Story
export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Dark Mode Support
The grayscale theme includes comprehensive dark mode support with appropriate color adjustments for better contrast and readability.

Dark mode colors are automatically applied when the parent container has the \`dark\` class or when using the system's dark mode preference.

\`\`\`jsx
<div className="dark">
  <Button color="gray">Dark Mode Button</Button>
  <Card className="bg-gray-800">
    <h5 className="text-white">Dark Card</h5>
  </Card>
</div>
\`\`\`
`,
      },
    },
  },
  render: () => (
    <ThemeComparison
      defaultContent={
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Default Theme Dark Mode
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button className="w-32">Primary</Button>
              <Button className="w-32" outline>
                Outline
              </Button>
            </div>
            <Card className="max-w-sm bg-gray-800">
              <h5 className="text-2xl font-bold tracking-tight text-white">
                Dark Card
              </h5>
              <p className="font-normal text-gray-400">
                This card demonstrates dark mode styling.
              </p>
              <Button className="mt-4">Read more</Button>
            </Card>
            <Alert className="w-96 bg-gray-800">
              <span className="font-medium text-white">Dark alert!</span> This
              is an alert in dark mode.
            </Alert>
          </div>
        </div>
      }
      grayscaleContent={
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Grayscale Theme Dark Mode
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button color="gray" className="w-32">
                Primary
              </Button>
              <Button color="gray" className="w-32" outline>
                Outline
              </Button>
            </div>
            <Card className="max-w-sm bg-gray-800">
              <h5 className="text-2xl font-bold tracking-tight text-white">
                Dark Card
              </h5>
              <p className="font-normal text-gray-400">
                This card demonstrates dark mode styling.
              </p>
              <Button color="gray" className="mt-4">
                Read more
              </Button>
            </Card>
            <Alert color="gray" className="w-96 bg-gray-800">
              <span className="font-medium text-white">Dark alert!</span> This
              is a grayscale alert in dark mode.
            </Alert>
          </div>
        </div>
      }
    />
  ),
};
