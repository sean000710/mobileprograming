// C3. 🔥 인기 게시물 (좌우 화살표 + 점 3개 캐러셀)
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  View,
} from 'react-native';

import { PostCard } from '@/features/feed/components/PostCard';
import { AppText, Icon } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { PostSummary } from '@/types/models';

type Props = {
  posts: PostSummary[];
  onPressPost: (id: string) => void;
  onReport: (id: string) => void;
};

export function PopularCarousel({ posts, onPressPost, onReport }: Props) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);

  if (posts.length === 0) return null;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(posts.length - 1, next));
    scrollRef.current?.scrollTo({ x: clamped * pageWidth, animated: true });
    setIndex(clamped);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth > 0) setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
  };

  return (
    <View style={styles.section}>
      <AppText size={14} weight="700">
        🔥 인기 게시물
      </AppText>

      <View style={styles.carouselRow}>
        <Pressable accessibilityLabel="이전" style={styles.arrow} onPress={() => goTo(index - 1)}>
          <Icon name="chevron-left" size={16} color={colors.textSecondary} />
        </Pressable>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.flex}
          onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
          onMomentumScrollEnd={onScrollEnd}>
          {posts.map((p) => (
            <View key={p.id} style={{ width: pageWidth || undefined }}>
              <PostCard post={p} onPress={() => onPressPost(p.id)} onReport={() => onReport(p.id)} />
            </View>
          ))}
        </ScrollView>

        <Pressable accessibilityLabel="다음" style={styles.arrow} onPress={() => goTo(index + 1)}>
          <Icon name="chevron-right" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.dots}>
        {posts.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: 10 },
  carouselRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 14, backgroundColor: colors.primary },
});
