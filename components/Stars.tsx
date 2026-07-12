import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarsProps {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 11 }: StarsProps) {
  const fullStars = Math.floor(rating);
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= fullStars ? 'star' : 'star-outline'}
          size={size}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}
