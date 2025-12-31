import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type AboutArgs = {
  portrait: Media
}

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const buildRichText = (heading: string, body: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [textNode(heading)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h3' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [textNode(body)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const buildParagraph = (body: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [textNode(body)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const about: (args: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  portrait,
}) => {
  return {
    slug: 'about',
    _status: 'published',
    title: 'About',
    hero: {
      type: 'lowImpact',
      richText: buildParagraph('Travis Ehrenstrom Band: a documentary-style timeline and biography.'),
    },
    layout: [
      {
        blockType: 'quickSummary',
        eyebrow: 'At a Glance',
        title: 'Travis Ehrenstrom Band',
        who: 'Indie-folk multi-instrumentalist & 6-piece band from Central Oregon',
        what: 'Original songs blending folk storytelling with funk & jam-band grooves',
        where: 'Bend, Oregon & the Pacific Northwest',
        when: 'Active since 2017 (solo work since 2004)',
        why: 'Music that connects communities through honest songwriting',
      },
      {
        blockType: 'documentaryTimeline',
        eyebrow: 'Documentary Timeline',
        title: 'Travis Ehrenstrom Band: A Documentary-Style Timeline and Biography',
        intro: buildParagraph(
          'From Central Oregon roots to national tours, a cross-country songwriting journey, and a post-pandemic revival, this timeline traces the moments that shaped Travis Ehrenstrom and TEB.',
        ),
        timeline: [
          {
            period: '2004-2007',
            chapter: 'Small-Town Beginnings',
            tagline: 'Archive Footage',
            location: 'Sisters, Oregon',
            release: 'Somewhere in Between (2007)',
            media: portrait.id,
            summary: buildParagraph(
              'Raised in rural Central Oregon, Travis picked up guitar at 14, joined the Sisters High School Americana Project, and started gigging with local mentors. He formed National Theater Project and recorded his debut album in Santa Cruz while still a teen.',
            ),
            highlights: [
              {
                text: 'Opened for the Blind Boys of Alabama at Les Schwab Amphitheater.',
              },
              {
                text: 'Early shows stretched from Bend to Seattle and Santa Monica.',
              },
            ],
            accent: 'sunrise',
          },
          {
            period: '2008-2011',
            chapter: 'On the Road and The Courage',
            tagline: 'Touring Years',
            location: 'Portland to Seattle',
            summary: buildParagraph(
              "A brief stint at Portland State gave way to national touring as a solo artist. In Seattle, he joined Noah Gundersen's backing band The Courage, opening for Josh Ritter and Kimya Dawson before the group disbanded.",
            ),
            highlights: [
              {
                text: 'National tours as a multi-instrumentalist.',
              },
              {
                text: 'Returned home with a new perspective on the road.',
              },
            ],
            accent: 'coast',
          },
          {
            period: '2013',
            chapter: 'Remain A Mystery',
            tagline: 'Studio Diary',
            location: 'Bend, Oregon',
            release: 'Remain A Mystery (2013)',
            summary: buildParagraph(
              'Kickstarter-funded and self-produced over nine months, Remain A Mystery captured his early-twenties restlessness. The album earned local acclaim and positioned him as a standout Northwest songwriter.',
            ),
            highlights: [
              {
                text: 'Named a top Central Oregon release of the year.',
              },
              {
                text: 'Praised for warm, introspective folk-pop storytelling.',
              },
            ],
            quote: {
              text: 'An engaging, eclectic take on folk-pop-rock with heart.',
              attribution: 'The Source Weekly',
            },
            accent: 'ember',
          },
          {
            period: '2014-2016',
            chapter: 'The Pause and the Reset',
            tagline: 'Off Camera',
            location: 'Central Oregon',
            summary: buildParagraph(
              "A creative lull led him to step away, build a life focused on family, and work in tech. The Artist's Way and a daily writing ritual reignited his songwriting spark.",
            ),
            highlights: [
              {
                text: 'Morning pages and new habits reopened the creative flow.',
              },
              {
                text: 'A reset that set the stage for the band years.',
              },
            ],
            quote: {
              text: 'At one point, I had really kind of lost that piece of me.',
              attribution: 'Travis Ehrenstrom',
            },
            accent: 'sage',
          },
          {
            period: '2017-2018',
            chapter: 'Forming the Band',
            tagline: 'The Ensemble',
            location: 'Bend, Oregon',
            summary: buildParagraph(
              'Travis assembled a six-piece band of longtime friends, including bassist Patrick Pearsall and drummer Kyle Pickard. The lineup blended folk storytelling with funk and jam-band grooves.',
            ),
            highlights: [
              {
                text: 'Local jam sessions evolved into a tight live unit.',
              },
              {
                text: 'Improvisation became the heartbeat of the show.',
              },
            ],
            quote: {
              text: 'Being in a band is the top of the mountain for me.',
              attribution: 'Travis Ehrenstrom',
            },
            accent: 'ember',
          },
          {
            period: '2018',
            chapter: 'Something on the Surface',
            tagline: 'Breakthrough Record',
            location: 'Bend, Oregon',
            release: 'Something on the Surface (2018)',
            summary: buildParagraph(
              'The debut full-band album embraced confidence and introspection, with a polished roots-rock sound and big hooks. Critics praised its range and craftsmanship across ten songs.',
            ),
            highlights: [
              {
                text: 'A title track built around a climbing chorus.',
              },
              {
                text: 'The band rehearsed heavily before hitting the road.',
              },
            ],
            accent: 'sunrise',
          },
          {
            period: '2018-2019',
            chapter: 'Festivals and Regional Tours',
            tagline: 'Live Chapter',
            location: 'Pacific Northwest',
            summary: buildParagraph(
              'TEB hit the regional circuit, appearing at Sisters Folk Festival, 4 Peaks, and Cascade Equinox while building a reputation as a must-see live act.',
            ),
            highlights: [
              {
                text: 'Home-region stages at McMenamins and The Belfry.',
              },
              {
                text: 'Extended jams and spontaneous detours on stage.',
              },
            ],
            accent: 'coast',
          },
          {
            period: '2019',
            chapter: 'Northwest Americana + Our Creative States',
            tagline: 'Road Journal',
            location: 'Across the USA',
            release: 'Northwest Americana (2019)',
            summary: buildParagraph(
              'A winter EP leaned into roots and traditional instrumentation. Later that year, Travis and his family traveled by RV, writing a song for each state and releasing them as a rolling series.',
            ),
            highlights: [
              {
                text: 'A Song For Every State captured the trip in real time.',
              },
              {
                text: 'Songs were written from rivers, mountain passes, and small towns.',
              },
            ],
            accent: 'sage',
          },
          {
            period: '2020-2022',
            chapter: 'Pandemic Years',
            tagline: 'Lockdown Sessions',
            location: 'Central Oregon',
            release: 'Selections (2020) / The Plagued Years (2022)',
            summary: buildParagraph(
              "With touring paused, Travis turned to livestreams and new releases. The Plagued Years distilled the era's uncertainty into five reflective songs.",
            ),
            highlights: [
              {
                text: 'Livestreams kept the community connected.',
              },
              {
                text: 'Music as a record of resilience and reflection.',
              },
            ],
            accent: 'midnight',
          },
          {
            period: '2023-2024',
            chapter: 'TEB Era',
            tagline: 'New Name, New Energy',
            location: 'Bend, Oregon',
            release: 'Hollinshead (2023) / Lady Luck (2024)',
            summary: buildParagraph(
              'The band rebranded to TEB and released Hollinshead, followed by Lady Luck, recorded live in a living room to capture on-stage chemistry.',
            ),
            highlights: [
              {
                text: 'High-profile hometown shows relaunched the band.',
              },
              {
                text: 'Live recording to bottle the band interplay.',
              },
            ],
            accent: 'ember',
          },
          {
            period: '2025+',
            chapter: 'Next Chapter',
            tagline: 'Rolling Credits',
            location: 'Pacific Northwest',
            release: 'Nothing To It (2025)',
            summary: buildParagraph(
              'New collaborations and releases signal the next phase, balancing intimate solo sets with full-band festival energy.',
            ),
            highlights: [
              {
                text: 'Continued festival appearances across the region.',
              },
              {
                text: 'Songwriting still anchored in community and place.',
              },
            ],
            accent: 'sunrise',
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'half',
            richText: buildRichText(
              'Highlights',
              'Festival appearances, touring, and standout releases including a 50-state songwriting project.',
            ),
          },
          {
            size: 'half',
            richText: buildRichText(
              'Sound',
              'Folk storytelling meets fusion-rock grooves, soul-leaning hooks, and live improvisation.',
            ),
          },
        ],
      },
      {
        blockType: 'teamGrid',
        heading: 'The Lineup',
        subheading: 'Meet the Band',
        layout: 'baseballCards',
        members: [
          {
            name: 'Travis Ehrenstrom',
            role: 'Vocals / Guitar / Strings',
            hometown: 'Sisters, OR',
            yearsActive: '2004–Present',
            funFact: '50 states, 50 songs',
            number: '01',
          },
          {
            name: 'Patrick Pearsall',
            role: 'Bass / Vocals',
            hometown: 'Bend, OR',
            yearsActive: '2017–Present',
            funFact: 'The groove anchor',
            number: '02',
          },
          {
            name: 'Conner Bennett',
            role: 'Lead Guitar',
            hometown: 'Bend, OR',
            yearsActive: '2017–Present',
            funFact: 'Solo wizard',
            number: '03',
          },
          {
            name: 'Patrick Ondrozeck',
            role: 'Keys',
            hometown: 'Bend, OR',
            yearsActive: '2017–Present',
            funFact: 'Textural magic',
            number: '04',
          },
          {
            name: 'Kyle Pickard',
            role: 'Drums',
            hometown: 'Bend, OR',
            yearsActive: '2017–Present',
            funFact: 'Pocket master',
            number: '05',
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(
              'Press',
              '"Ehrenstrom\'s songwriting is a through line, threading heartfelt stories with rich musicianship." - Press quote here',
            ),
          },
        ],
      },
    ],
  }
}
