/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'access_token.store': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_token.store']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/auth/signup',
    tokens: [{"old":"/auth/signup","type":0,"val":"auth","end":""},{"old":"/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'access_token.destroy': {
    methods: ["DELETE"],
    pattern: '/auth/logout',
    tokens: [{"old":"/auth/logout","type":0,"val":"auth","end":""},{"old":"/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_token.destroy']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'dashboard.report': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/report',
    tokens: [{"old":"/dashboard/report","type":0,"val":"dashboard","end":""},{"old":"/dashboard/report","type":0,"val":"report","end":""}],
    types: placeholder as Registry['dashboard.report']['types'],
  },
  'sellers.index': {
    methods: ["GET","HEAD"],
    pattern: '/sellers',
    tokens: [{"old":"/sellers","type":0,"val":"sellers","end":""}],
    types: placeholder as Registry['sellers.index']['types'],
  },
  'sellers.store': {
    methods: ["POST"],
    pattern: '/sellers',
    tokens: [{"old":"/sellers","type":0,"val":"sellers","end":""}],
    types: placeholder as Registry['sellers.store']['types'],
  },
  'sellers.show': {
    methods: ["GET","HEAD"],
    pattern: '/sellers/:id',
    tokens: [{"old":"/sellers/:id","type":0,"val":"sellers","end":""},{"old":"/sellers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sellers.show']['types'],
  },
  'sellers.update': {
    methods: ["PUT","PATCH"],
    pattern: '/sellers/:id',
    tokens: [{"old":"/sellers/:id","type":0,"val":"sellers","end":""},{"old":"/sellers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sellers.update']['types'],
  },
  'sellers.destroy': {
    methods: ["DELETE"],
    pattern: '/sellers/:id',
    tokens: [{"old":"/sellers/:id","type":0,"val":"sellers","end":""},{"old":"/sellers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sellers.destroy']['types'],
  },
  'sales.commission_preview': {
    methods: ["GET","HEAD"],
    pattern: '/sales/commission-preview',
    tokens: [{"old":"/sales/commission-preview","type":0,"val":"sales","end":""},{"old":"/sales/commission-preview","type":0,"val":"commission-preview","end":""}],
    types: placeholder as Registry['sales.commission_preview']['types'],
  },
  'sales.index': {
    methods: ["GET","HEAD"],
    pattern: '/sales',
    tokens: [{"old":"/sales","type":0,"val":"sales","end":""}],
    types: placeholder as Registry['sales.index']['types'],
  },
  'sales.store': {
    methods: ["POST"],
    pattern: '/sales',
    tokens: [{"old":"/sales","type":0,"val":"sales","end":""}],
    types: placeholder as Registry['sales.store']['types'],
  },
  'sales.show': {
    methods: ["GET","HEAD"],
    pattern: '/sales/:id',
    tokens: [{"old":"/sales/:id","type":0,"val":"sales","end":""},{"old":"/sales/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sales.show']['types'],
  },
  'sales.destroy': {
    methods: ["DELETE"],
    pattern: '/sales/:id',
    tokens: [{"old":"/sales/:id","type":0,"val":"sales","end":""},{"old":"/sales/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sales.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
