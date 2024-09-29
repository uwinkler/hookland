/* eslint-disable @typescript-eslint/no-explicit-any */

import { WrapperInternal } from './WrapperInternal'

const isDev = import.meta.env.MODE === 'production' ? false : true

export const Wrapper = isDev
  ? ({ children }: React.PropsWithChildren<unknown>) => {
      return <WrapperInternal>{children}</WrapperInternal>
    }
  : ({ children }: React.PropsWithChildren<unknown>) => children
