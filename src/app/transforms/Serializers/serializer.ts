
import {Token} from '../../models/token'

export interface Serializer {
    serialize(tokens: Token[]): string;
}

export * from './html-serializer'
export * from './string-serializer'