// Open one probe at a time in Canvas. Hard-refresh between cases.
// Watch the preview iframe's console; change label from A to B in Controls.
import { type Meta, type StoryObj } from "@storybook/nextjs";
import { version } from "react";
import { rscDecorator } from "../../.storybook/promiseDecorator";

type ProbeArgs = { label: string };
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function SyncProbe({ label }: ProbeArgs) {
  console.count("[RSC probe] sync entered");
  return <p data-testid="probe-value">{label}</p>;
}

// eslint-disable-next-line @typescript-eslint/require-await -- Isolate the Promise created by async alone.
async function ImmediateProbe({ label }: ProbeArgs) {
  console.count("[RSC probe] async without await entered");
  return <p data-testid="probe-value">{label}</p>;
}

function synchronousMock() {
  return "mock data";
}

async function SyncMockProbe({ label }: ProbeArgs) {
  console.count("[RSC probe] sync mock entered");
  // eslint-disable-next-line @typescript-eslint/await-thenable -- Test the real scheduling of await on a plain mock value.
  await synchronousMock();
  console.count("[RSC probe] sync mock resolved");
  return <p data-testid="probe-value">{label}</p>;
}

async function DelayedProbe({ label }: ProbeArgs) {
  console.count("[RSC probe] delayed entered");
  await delay(100);
  console.count("[RSC probe] delayed resolved");
  return <p data-testid="probe-value">{label}</p>;
}

let cachedDataPromise: Promise<void> | undefined;
function getCachedData() {
  return (cachedDataPromise ??= delay(100));
}

async function CachedDataProbe({ label }: ProbeArgs) {
  console.count("[RSC probe] cached data entered");
  await getCachedData();
  console.count("[RSC probe] cached data resolved");
  return <p data-testid="probe-value">{label}</p>;
}

function NestedProbe(args: ProbeArgs) {
  return (
    <section>
      <DelayedProbe {...args} />
    </section>
  );
}

const meta = {
  title: "Diagnostics/RSC",
  component: SyncProbe,
  args: { label: "A" },
  argTypes: { label: { control: "text" } },
  parameters: {
    layout: "padded",
    react: { rsc: true },
  },
  beforeEach: ({ id, args }) => {
    console.log(
      "[RSC probe] Storybook setup",
      JSON.stringify({
        id,
        label: args.label,
        reactVersionInPreview: version,
      }),
    );
  },
} satisfies Meta<ProbeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Baseline: should settle and update A -> B.
export const Synchronous: Story = {};

// May settle despite warnings. async alone still creates an outer Promise.
export const AsyncWithoutAwait: Story = {
  render: (args) => <ImmediateProbe {...args} />,
};

// Removes real I/O but retains async/await. Compare with the delayed case.
export const AwaitSynchronousMock: Story = {
  render: (args) => <SyncMockProbe {...args} />,
};

// Has no fetch, MSW, authentication, application layout, or business data.
// Persistent retries here implicate async rendering in the preview.
export const DelayedWithoutDecorator: Story = {
  render: (args) => <DelayedProbe {...args} />,
};

// A stable data Promise may let this simple case settle, but does not cache
// the Promise returned by the async component itself.
export const CachedDataOnly: Story = {
  render: (args) => <CachedDataProbe {...args} />,
};

// Uses the repository's existing workaround. Check both initial rendering
// AND whether Controls changes reach the displayed text.
export const DelayedWithExistingDecorator: Story = {
  render: (args) => <DelayedProbe {...args} />,
  decorators: [rscDecorator],
};

// Confirms whether a remaining async child explains a partially mocked tree.
export const NestedDelayedWithoutDecorator: Story = {
  render: (args) => <NestedProbe {...args} />,
};
