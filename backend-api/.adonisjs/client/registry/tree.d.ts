/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessToken: {
    store: typeof routes['access_token.store']
    destroy: typeof routes['access_token.destroy']
  }
  newAccount: {
    store: typeof routes['new_account.store']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  dashboard: {
    index: typeof routes['dashboard.index']
    report: typeof routes['dashboard.report']
  }
  sellers: {
    index: typeof routes['sellers.index']
    store: typeof routes['sellers.store']
    show: typeof routes['sellers.show']
    update: typeof routes['sellers.update']
    destroy: typeof routes['sellers.destroy']
  }
  sales: {
    commissionPreview: typeof routes['sales.commission_preview']
    index: typeof routes['sales.index']
    store: typeof routes['sales.store']
    show: typeof routes['sales.show']
    destroy: typeof routes['sales.destroy']
  }
}
