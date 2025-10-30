import { createRouter, createWebHistory } from 'vue-router'
import UserList from './pages/Users/UserList.vue'
import UserDetail from './pages/Users/UserDetail.vue'
import TaskList from './pages/Tasks/TaskList.vue'
import TaskDetail from './pages/Tasks/TaskDetail.vue'
import FeedbackList from './pages/Feedback/FeedbackList.vue'
import ReviewList from './pages/Reviews/ReviewList.vue'
import ContentFeedbackList from './pages/ContentFeedback/ContentFeedbackList.vue'

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: TaskDetail
  },
  {
    path: '/feedback',
    name: 'FeedbackList',
    component: FeedbackList
  },
  {
    path: '/reviews',
    name: 'ReviewList',
    component: ReviewList
  },
  {
    path: '/content-feedback',
    name: 'ContentFeedbackList',
    component: ContentFeedbackList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
