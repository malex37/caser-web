// <reference types='vite/client' />
import { ApiTypes } from '@models/api/Definitions'
declare global {
  interface Window {
    api: ApiTypes
  }
}
