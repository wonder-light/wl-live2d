import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Emersion from './Emersion.vue';

createApp(import.meta.env.EMERSION ? Emersion : App).mount('#app');
