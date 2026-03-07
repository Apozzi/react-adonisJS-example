import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * GET /users
   * List all users
   */
  async index({ }: HttpContext) {
    return await User.query().orderBy('full_name', 'asc')
  }

  /**
   * GET /users/:id
   */
  async show({ params, response }: HttpContext) {
    const user = await User.find(Number(params.id))

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return user
  }
}
