import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import vine from '@vinejs/vine'

const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2).maxLength(120).nullable(),
    email: vine.string().email().maxLength(254),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export default class UsersController {
  /**
   * GET /users
   */
  async index({ serialize }: HttpContext) {
    const users = await User.query().orderBy('full_name', 'asc')
    return serialize(users)
  }

  /**
   * GET /users/:id
   */
  async show({ params, response, serialize }: HttpContext) {
    const user = await User.find(Number(params.id))
    if (!user) return response.notFound({ message: 'User not found' })
    return serialize(user)
  }

  /**
   * POST /users
   */
  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.unprocessableEntity({
        errors: [{ field: 'email', message: 'E-mail já está em uso.' }],
      })
    }

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    return response.created(
      serialize(user)
    )
  }

  /**
   * DELETE /users/:id
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = await User.find(Number(params.id))
    if (!user) return response.notFound({ message: 'User not found' })

    // Prevent self-deletion
    const currentUser = auth.getUserOrFail()
    if (currentUser.id === user.id) {
      return response.forbidden({ message: 'Você não pode deletar sua própria conta.' })
    }

    await user.delete()
    return response.noContent()
  }
}