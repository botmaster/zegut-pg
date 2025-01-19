import type { AxiosError } from 'axios'

export interface ExtendedAxiosError extends AxiosError {
  statusCode?: number
}

export interface CustomError extends Error {
  customCode?: number
  rawError?: Error
}
