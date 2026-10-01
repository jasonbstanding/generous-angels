import { createRouter, createWebHashHistory } from 'vue-router'
import TimelineView from '../views/TimelineView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: TimelineView },
    { path: '/gantt', component: () => import('../views/GanttView.vue') },
    { path: '/rankings', component: () => import('../views/RankingsView.vue') },
  ],
})

export default router
