import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { PlayerProvider } from './Player'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <PlayerProvider>{children}</PlayerProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
