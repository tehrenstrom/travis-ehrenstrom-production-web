import React from 'react'

import type { PressQuotesBlock as PressQuotesBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

export const PressQuotesBlock: React.FC<PressQuotesBlockProps> = ({
  heading,
  subheading,
  quotes,
  recentPress,
}) => {
  const hasQuotes = quotes && quotes.length > 0
  const hasRecentPress = recentPress && recentPress.length > 0

  if (!hasQuotes && !hasRecentPress) {
    return null
  }

  return (
    <section className="container my-16">
      <div
        className="vintage-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <div className="flex items-center gap-3 mb-3">
                <span className="ornament-star text-accent/50" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {subheading}
                </span>
              </div>
            )}
            {heading && (
              <h2 className="font-display text-display-sm md:text-display-md">{heading}</h2>
            )}
          </div>
        )}

        {/* Quotes */}
        {hasQuotes && (
          <div className="space-y-8">
            {quotes.map((item, index) => (
              <blockquote
                key={item.id || index}
                className={cn(
                  'opacity-0 animate-fade-up',
                  'border-l-2 border-accent/40 pl-6 py-2',
                )}
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <p className="text-lg md:text-xl italic text-foreground/90 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-4 flex flex-wrap items-center gap-2">
                  {item.attribution && (
                    <span className="text-sm font-medium">— {item.attribution}</span>
                  )}
                  {item.source && (
                    <>
                      {item.attribution && <span className="text-muted-foreground/50">|</span>}
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          {item.source}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">{item.source}</span>
                      )}
                    </>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        {/* Divider */}
        {hasQuotes && hasRecentPress && (
          <div className="flex items-center my-10">
            <span className="h-px flex-1 bg-border" />
            <span className="ornament-diamond mx-4 text-accent/40" />
            <span className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* Recent Press Links */}
        {hasRecentPress && (
          <div
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${200 + (quotes?.length || 0) * 100}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <h3 className="text-label uppercase tracking-stamp-wide text-muted-foreground mb-4">
              Recent Press
            </h3>
            <ul className="space-y-2">
              {recentPress.map((item, index) => (
                <li key={item.id || index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors',
                      'group',
                    )}
                  >
                    <span className="h-1 w-1 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    <span>{item.title}</span>
                    <svg
                      className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

