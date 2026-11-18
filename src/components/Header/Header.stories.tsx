import AuthProvider from "@/app/AuthProvider";
import { type Meta, type StoryObj } from "@storybook/nextjs";
import Header from ".";

const meta = {
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider session={null}>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="[&_header]:!w-full">
        <Story />
      </div>
    ),
  ],
};

export const LoggedOut: Story = {};
