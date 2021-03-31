import { FC, ReactElement } from 'react'
import { AppProps } from 'next/app'

import { AuthProvider } from '@lib/auth'

import '@styles/globals.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }): ReactElement => {
  return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
  )
}

export default MyApp
