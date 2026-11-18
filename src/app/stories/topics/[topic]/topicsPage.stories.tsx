import { StoryTopic } from "@prisma/client";
import { type Meta, type StoryObj } from "@storybook/nextjs";
import RootLayoutBody from "#src/components/layout-components/RootBody/RootBody";
import { type ComponentProps } from "react";
import { db, reset } from "../../../../../mocks/data.mock";
import { createSpecificStories } from "../../../../../mocks/functions/storyFunctions";
import StoryTopicPage from "./page";

const topics = [
  StoryTopic.ASTRONOMY.toLowerCase(),
  StoryTopic.BIOLOGY.toLowerCase(),
  StoryTopic.CHEMICAL_ENGINEERING.toLowerCase(),
  StoryTopic.CHEMISTRY.toLowerCase(),
  StoryTopic.COMPUTER_SCIENCE.toLowerCase(),
  StoryTopic.ELECTRICAL_ENGINEERING.toLowerCase(),
  StoryTopic.ENVIRONMENTAL_SCIENCE.toLowerCase(),
  StoryTopic.GEOLOGY.toLowerCase(),
  StoryTopic.MATHEMATICS.toLowerCase(),
  StoryTopic.MECHANICAL_ENGINEERING.toLowerCase(),
  StoryTopic.MEDICINE.toLowerCase(),
  StoryTopic.PHYSICS.toLowerCase(),
  StoryTopic.PSYCHOLOGY.toLowerCase(),
  StoryTopic.SOCIOLOGY.toLowerCase(),
  StoryTopic.TECHNOLOGY.toLowerCase(),
] as const;

type PageProps = ComponentProps<typeof StoryTopicPage>;
type PagePropsAndCustomArgs = {
  params: Awaited<PageProps["params"]>;
  numStories: number;
};

const meta: Meta<PagePropsAndCustomArgs> = {
  // Controls edit plain values. The loader supplies Next's promised page props
  // once per story setup, so React retries receive the same route inputs.
  loaders: [
    ({ args }) => ({
      pageProps: {
        params: Promise.resolve(args.params),
        searchParams: Promise.resolve({ page_number: "1" }),
      } satisfies PageProps,
    }),
  ],
  render: (_args, { loaded }) => (
    <StoryTopicPage {...(loaded.pageProps as PageProps)} />
  ),
  argTypes: {
    params: {
      options: [...topics, "BioLoGy", "random-text"],
      mapping: {
        ...topics.reduce(
          (accumulator, currentVal) => {
            accumulator[currentVal] = {
              topic: currentVal,
            };
            return accumulator;
          },
          {} as {
            [topicName: string]: {
              topic: string;
            };
          },
        ),
        BioLoGy: {
          topic: "BioLoGy",
        },
        "random-text": {
          topic: "random-text",
        },
      },
    },
  },
  decorators: (Story) => (
    <RootLayoutBody session={null}>
      <Story />
    </RootLayoutBody>
  ),
};

export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const MainStory: Story = {
  args: {
    numStories: 10,
    params: {
      topic: topics[1],
    },
  },

  loaders: [
    ({ args }) => {
      reset(123);
      console.log("topic exists?: ", topics.includes(args.params.topic));
      console.log(args.numStories);
      if (topics.includes(args.params.topic)) {
        createSpecificStories(
          { topics: [args.params.topic.toUpperCase() as StoryTopic] },
          args.numStories,
        );
      }
      console.log("story count: ", db.story.count());
    },
  ],
};

export const PhoneScreen: Story = {
  ...MainStory,
  globals: {
    viewport: {
      value: "iphonex",
      isRotated: false,
    },
  },
};
