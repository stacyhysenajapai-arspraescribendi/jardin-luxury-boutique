import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

/** Light tick for selections (sizes, chips, tabs). */
export const tapLight = () => {
  if (enabled) Haptics.selectionAsync().catch(() => {});
};

/** Medium impact for primary actions (CTA, save). */
export const tapMedium = () => {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};

export const success = () => {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};
