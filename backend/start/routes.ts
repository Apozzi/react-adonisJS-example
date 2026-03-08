import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'


router.post('/auth/login', '#controllers/access_token_controller.store')
router.post('/auth/signup', '#controllers/new_account_controller.store')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})


router
  .group(() => {
    // Auth
    router.delete('/auth/logout', '#controllers/access_token_controller.destroy')

    // Profile
    router.get('/profile', '#controllers/profile_controller.show')

    // Users
    router.resource('users', '#controllers/users_controller').apiOnly()

    // Dashboard
    router.get('/dashboard', '#controllers/dashboard_controller.index')
    router.get('/dashboard/report', '#controllers/dashboard_controller.report')

    // Sellers
    router.resource('sellers', '#controllers/sellers_controller').apiOnly()

    // Sales
    router.get('/sales/commission-preview', '#controllers/sales_controller.commissionPreview')
    router.resource('sales', '#controllers/sales_controller').apiOnly().except(['update'])

  })
  .use(middleware.auth())
