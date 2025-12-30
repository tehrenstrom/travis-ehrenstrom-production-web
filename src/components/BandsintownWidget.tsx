import Script from 'next/script'
import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  artistId?: string
  artistName?: string
  displayLimit?: number
  showPastDates?: boolean
  theme?: 'dark' | 'light'
}

const themeColors = {
  dark: {
    text: '#F4EFE7',
    link: '#F4EFE7',
  },
  light: {
    text: '#2B241B',
    link: '#2B241B',
  },
}

export const BandsintownWidget: React.FC<Props> = ({
  className,
  artistId = '2359898',
  artistName = 'Travis Ehrenstrom Band',
  displayLimit = 50,
  showPastDates = false,
  theme = 'dark',
}) => {
  const colors = themeColors[theme]

  return (
    <div
      className={cn(
        'teb-bandsintown rounded-[32px] border border-foreground/10 bg-card/90 p-6 shadow-[0_28px_70px_-48px_rgba(0,0,0,0.6)] backdrop-blur md:p-8',
        className,
      )}
      data-theme={theme === 'dark' ? 'dark' : undefined}
    >
      <a
        className="bit-widget-initializer"
        data-artist-id={artistId}
        data-artist-name={artistName}
        data-auto-style="false"
        data-background-color="transparent"
        data-display-limit={String(displayLimit)}
        data-display-local-dates="true"
        data-display-logo="false"
        data-display-past-dates={showPastDates ? 'true' : 'false'}
        data-display-play-my-city="true"
        data-display-track-button="true"
        data-link-color={colors.link}
        data-text-color={colors.text}
      />
      <Script src="https://widget.bandsintown.com/main.min.js" strategy="afterInteractive" />
    </div>
  )
}
