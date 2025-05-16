import { type LabelProps as LabelRekaProps } from 'reka-ui'
import { type HTMLAttributes } from 'vue'

export { default as Label } from './Label.vue'

export interface LabelProps extends LabelRekaProps {
    class?: HTMLAttributes['class']
}
