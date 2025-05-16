import type { User } from '@/types'
import { set } from '@vueuse/core'
import { defineStore } from 'pinia'

interface State {
    user: User | null
    app: {
        name: string
        version: string
        description: string
        logo: string
    } | null
}

export const useGlobalStore = defineStore('global', {
    state: (): State => ({
        user: null,
        app: null,
    }),
    actions: {
        setApp(value: State['app']) {
            this.app = value
        },
        setUser(value: State['user']) {
            this.user = value
        },
    },
})
