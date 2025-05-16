import '@/assets/css/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { initializeTheme } from '@/composables/useAppearance'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')

initializeTheme('light')
