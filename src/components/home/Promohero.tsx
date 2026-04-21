import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const HERO_H = 210;
export interface CarouselImage {
  id: string | number;
  image: string;
}                                                              
           
interface PromoHeroProps {
  slides: CarouselImage[];
  autoPlayInterval?: number;
}

export function PromoHero({ slides, autoPlayInterval = 4000 }: PromoHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const timerRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % slides.length;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, autoPlayInterval);
  }, [slides.length, autoPlayInterval]);

  useEffect(() => {
    if (slides.length > 0) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer, slides.length]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const idx = viewableItems[0].index ?? 0;
        setActiveIndex(idx);
        activeIndexRef.current = idx;
      }
    },
    [],
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (slides.length === 0) return null;

  return (
    <View style={styles.heroContainer}>
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        onScrollBeginDrag={() =>
          timerRef.current && clearInterval(timerRef.current)
        }
        onScrollEndDrag={startTimer}
        getItemLayout={(_, index) => ({
          length: SW,
          offset: SW * index,
          index,
        })}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        )}
      />

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              flatRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveIndex(i);
              startTimer();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: HERO_H,
    overflow: "hidden",
  },
  image: {
    width: SW,
    height: HERO_H,
  },
  dotsRow: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    borderRadius: 4,
    height: 5,
  },
  dotActive: {
    width: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  dotInactive: {
    width: 5,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});
