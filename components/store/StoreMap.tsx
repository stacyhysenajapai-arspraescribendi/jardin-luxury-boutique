import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import config from '../../config';
import { colors } from '../../theme/theme';

/**
 * Native map with a pin at the boutique.
 * iOS uses Apple Maps (no key). Android uses Google Maps and needs an API key in
 * app.json → android.config.googleMaps.apiKey for production builds (see README).
 */
export function StoreMap({ height = 240 }: { height?: number }) {
  const { latitude, longitude } = config.coordinates;
  return (
    <View style={{ height, backgroundColor: colors.champagne }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude, longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        accessibilityLabel={`Map: ${config.address.full}`}
      >
        <Marker coordinate={{ latitude, longitude }} title="JARDIN Luxury Boutique" description={config.address.full} pinColor={colors.brass} />
      </MapView>
    </View>
  );
}
