import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AnnouncementBlock } from '@/blocks/Announcement/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DocumentaryTimelineBlock } from '@/blocks/DocumentaryTimeline/Component'
import { FeaturedReleaseBlock } from '@/blocks/FeaturedRelease/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ShowsPreviewBlock } from '@/blocks/ShowsPreview/Component'
import { SocialLinksBlock } from '@/blocks/SocialLinks/Component'
import { SplitContentBlock } from '@/blocks/SplitContent/Component'

const blockComponents = {
  announcement: AnnouncementBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  documentaryTimeline: DocumentaryTimelineBlock,
  featuredRelease: FeaturedReleaseBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  showsPreview: ShowsPreviewBlock,
  socialLinks: SocialLinksBlock,
  splitContent: SplitContentBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
