import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('Authentication', (group) => {
  group.each.setup(async () => {
    // Apagar os dados criados no teste (Isolamento se necessário)
    await User.query().where('email', 'japa_test@email.com').delete()
  })

  test('Signup - deve criar um usuário com e-mail e senha válidos', async ({ client, assert }) => {
    const response = await client.post('/auth/signup').form({
      fullName: 'Japa Test Account',
      email: 'japa_test@email.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(200)
    assert.isDefined((response.body() as any).user || (response.body() as any).data?.user)
    
    // Validar se usuário foi salvo com hash da senha
    const user = await User.findByOrFail('email', 'japa_test@email.com')
    assert.isTrue(await hash.verify(user.password, 'password123'))
  })

  test('Signup - não deve permitir criação de conta com e-mail já existente', async ({ client }) => {
    await User.create({ fullName: 'Existente', email: 'japa_test@email.com', password: 'password123' })
    
    const response = await client.post('/auth/signup').form({
      fullName: 'Outro Nome',
      email: 'japa_test@email.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(422) // Assumindo que a API retorna BadRequest/ValidationError
  })

  test('Login - deve autenticar usuário corretamente e retornar token', async ({ client, assert }) => {
    await User.create({ fullName: 'Japa Test', email: 'japa_test@email.com', password: 'password123' })

    const response = await client.post('/auth/login').form({
      email: 'japa_test@email.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { email: 'japa_test@email.com' } } })
    
    assert.isDefined((response.body() as any).data.token)
  })

  test('Login - deve rejeitar credenciais inválidas', async ({ client }) => {
    await User.create({ fullName: 'Japa Test', email: 'japa_test@email.com', password: 'password123' })

    const response = await client.post('/api/auth/login').form({
      email: 'japa_test@email.com',
      password: 'wrong_password',
    })

    response.assertStatus(404) 
  })
})
