import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

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

interface TechCardProps {
  name: string;
  specialty: string;
  rating: number;
  jobs: number;
  price: number;
  initials: string;
  color: string;
  onViewProfile?: () => void;
  onBook?: () => void;
}

export function TechCard({
  name,
  specialty,
  rating,
  jobs,
  price,
  initials,
  color,
  onViewProfile,
  onBook,
}: TechCardProps) {
  const { Card, Avatar, Badge } = require('@/components/Card');
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Avatar initials={initials} color={color} size={52} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: theme.text }}>{name}</Text>
            <Badge variant="blue">Pro</Badge>
          </View>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{specialty}</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Stars rating={rating} size={12} />
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{rating}</Text>
            <Text style={{ fontSize: 11, color: theme.textDim }}>&middot;</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{jobs} jobs</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={onViewProfile}
        >
          <Text style={{ color: theme.text, fontSize: 13, fontWeight: '500' }}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: theme.accent,
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={onBook}
        >
          <Text style={{ color: theme.bg, fontSize: 13, fontWeight: '700' }}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

import { Text, TouchableOpacity } from 'react-native';
