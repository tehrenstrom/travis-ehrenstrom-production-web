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
        className="rounded-md border border-border bg-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <p className="font-mono text-label uppercase text-primary mb-3">{subheading}</p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
                {heading}
              </h2>
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
                  'border-l-stamp border-primary pl-5 py-1.5',
                )}
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <p className="text-lg italic leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-3 flex flex-wrap items-center gap-2 font-mono text-2xs uppercase tracking-label text-muted-foreground">
                  {item.attribution && <span>— {item.attribution}</span>}
                  {item.source && (
                    <>
                      {item.attribution && <span aria-hidden="true">·</span>}
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 transition-colors duration-fast ease-teb-out hover:text-primary"
                        >
                          {item.source}
                        </a>
                      ) : (
                        <span>{item.source}</span>
                      )}
                    </>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        {/* Divider */}
        {hasQuotes && hasRecentPress && <hr className="my-10 border-border" />}

        {/* Recent Press Links */}
        {hasRecentPress && (
          <div
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${200 + (quotes?.length || 0) * 100}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <h3 className="font-mono text-label uppercase text-primary mb-4">Recent press</h3>
            <ul className="space-y-2">
              {recentPress.map((item, index) => (
                <li key={item.id || index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 text-foreground transition-colors duration-fast ease-teb-out hover:text-primary',
                      'group',
                    )}
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/50 transition-colors duration-fast ease-teb-out group-hover:bg-primary" />
                    <span>{item.title}</span>
                    <svg
                      className="h-3 w-3 opacity-50 transition-opacity duration-fast group-hover:opacity-100"
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
