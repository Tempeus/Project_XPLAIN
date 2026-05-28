import Feed from '@/components/feed/Feed'
import { TOPICS } from '@/lib/topics'

export default function FeedPage() {
  return <Feed topics={TOPICS} />
}
