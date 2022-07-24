import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VoteView from '../views/VoteView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: 'vote',
    name: 'vote',
    component: VoteView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
   component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth) {
		const user = sessionStorage.getItem('user')
		// JSON.parse(user)でjsonからオブジェクト型に変換
		console.log('session', JSON.parse(user));

		if(!user) {
			if (!user) {
				next({
					path: '/login',
					query: { redirect: to.fullPath }
				})
			} else {
				next()
			}
		} else {
			next()
		}

		// firebase.auth().onAuthStateChanged( (user) => {
		// 	if (!user) {
		// 		next({
		// 			path: '/login',
		// 			query: { redirect: to.fullPath }
		// 		})
		// 	} else {
		// 		next()
		// 	}
		// })
	} else {
		next()
	}
})


export default router
