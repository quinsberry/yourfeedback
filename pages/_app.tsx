import { FC, ReactElement } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import 'focus-visible/dist/focus-visible'

import { AuthProvider } from '@lib/auth'

import { theme } from '@styles/theme'

const App: FC<AppProps> = ({ Component, pageProps }): ReactElement => {
    return (
        <>
            <Head>
                <title>YourFeedback</title>
            </Head>
            <ChakraProvider theme={theme}>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </ChakraProvider>
        </>
    )
}

export default App
