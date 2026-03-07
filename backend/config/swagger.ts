import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'Comissionamento API',
  version: '1.0.0',
  description: 'Documentação automática da API REST do sistema de comissionamento',
  tagIndex: 1, // Controller routing without api prefix
  productionEnv: 'production',
  info: {
    title: 'Comissionamento API',
    version: '1.0.0',
    description: 'Documentação automática da API REST do sistema de comissionamento',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
