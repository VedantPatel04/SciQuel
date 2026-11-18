import AuthProvider from "@/app/AuthProvider";
import { type Meta, type StoryObj } from "@storybook/nextjs";
import SideBar from "./SideBar";

const meta: Meta<typeof SideBar> = {
  component: SideBar,
  decorators: [
    (Story) => (
      <AuthProvider session={null}>
        <div className="min-h-[8rem] bg-sciquelTeal p-4 text-white">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SideBar>;

export const Closed: Story = {};
