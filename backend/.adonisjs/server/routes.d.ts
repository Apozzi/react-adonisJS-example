import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.report': { paramsTuple?: []; params?: {} }
    'sellers.index': { paramsTuple?: []; params?: {} }
    'sellers.store': { paramsTuple?: []; params?: {} }
    'sellers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sellers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sellers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.commission_preview': { paramsTuple?: []; params?: {} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'sales.store': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'sellers.store': { paramsTuple?: []; params?: {} }
    'sales.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sellers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.report': { paramsTuple?: []; params?: {} }
    'sellers.index': { paramsTuple?: []; params?: {} }
    'sellers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.commission_preview': { paramsTuple?: []; params?: {} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.report': { paramsTuple?: []; params?: {} }
    'sellers.index': { paramsTuple?: []; params?: {} }
    'sellers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.commission_preview': { paramsTuple?: []; params?: {} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sellers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sellers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}