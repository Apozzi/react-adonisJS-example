
import { DateTime } from 'luxon'
import vine, { VineDate, SimpleMessagesProvider } from '@vinejs/vine'
import { RequestValidator } from '@adonisjs/core/http'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

const messagesProvider = new SimpleMessagesProvider({
  'string': 'O campo {{ field }} deve ser uma string',
  'email': 'O campo {{ field }} deve ser um endereço de e-mail válido',
  'string.email': 'O campo {{ field }} deve ser um endereço de e-mail válido',
  'minLength': 'O campo {{ field }} deve ter pelo menos {{ min }} caracteres',
  'string.minLength': 'O campo {{ field }} deve ter pelo menos {{ min }} caracteres',
  'maxLength': 'O campo {{ field }} não pode ter mais de {{ max }} caracteres',
  'string.maxLength': 'O campo {{ field }} não pode ter mais de {{ max }} caracteres',
  'database.unique': 'O valor informado para o campo {{ field }} já está em uso',
  'password.sameAs': 'A confirmação de senha não confere',
  'sameAs': 'A confirmação de senha não confere',
  'required': 'O campo {{ field }} é obrigatório'
})

vine.messagesProvider = messagesProvider
RequestValidator.messagesProvider = () => messagesProvider

