# Storybook previews

SciQuel’s Storybook includes the homepage, topic pages, and shared components such as Header and ArticleCard. From a configured SciQuel checkout, run `npm ci`, `npx --no-install prisma generate`, and `npm run storybook`.

## Reproduce the homepage preview issue

Open **app → Home → Variable Story Count**. Change `numStories` from **1** to **3**. The preview still shows one article under **Read what’s new**. Reload with the count at **3** and all three articles appear.

The seven stories under **Diagnostics → RSC** isolate how the preview handles asynchronous components. In the delayed example, each render starts a new wait and the preview keeps retrying. With SciQuel’s `rscDecorator`, the first label appears, but changing it from A to B leaves A on screen. [Diagnostic stories](../src/stories/RscInvestigation.stories.tsx)
