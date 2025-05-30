import type { StorybookConfig } from '@storybook/vue3-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@chromatic-com/storybook',
        '@storybook/experimental-addon-test',
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    viteFinal: async (config) => {
        config.plugins?.push(tsconfigPaths())
        return config
    },
}
export default config
