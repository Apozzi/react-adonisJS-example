import { test } from '@japa/runner'
import User from '#models/user'

test.group('Users Management', (group) => {
  let adminUser: User

  group.setup(async () => {
    // Apaga usuário anterior e cria o admin do teste
    await User.query().where('email', 'admin_japa@email.com').delete()
    adminUser = await User.create({
      fullName: 'Admin Test User',
      email: 'admin_japa@email.com',
      password: 'admin_password123',
    })
  })

  group.each.setup(async () => {
    // Isolamento: remove usuários temporários de outros testes
    await User.query().where('email', 'temp_japa@email.com').delete()
  })

  test('Index - listar usuários requer estar autenticado', async ({ client }) => {
    const response = await client.get('/users')
    response.assertStatus(401)
  })

  test('Index - deve retornar a lista de usuários para um admin autenticado', async ({ client }) => {
    const response = await client.get('/users').loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains([{ email: 'admin_japa@email.com' }])
  })

  test('Store - deve criar um usuário corretamente', async ({ client }) => {
    const response = await client.post('/users').loginAs(adminUser).form({
      fullName: 'Temp Japa',
      email: 'temp_japa@email.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(201)
  })

  test('Destroy - deve poder excluir um usuário', async ({ client, assert }) => {
    const tempUsr = await User.create({ fullName: 'To Be Deleted', email: 'temp_japa@email.com', password: 'password123' })
    
    const response = await client.delete(`/users/${tempUsr.id}`).loginAs(adminUser)

    response.assertStatus(204)

    const stillExists = await User.find(tempUsr.id)
    assert.isNull(stillExists)
  })
})
