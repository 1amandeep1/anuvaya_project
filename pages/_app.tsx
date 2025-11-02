import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
