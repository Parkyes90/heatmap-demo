import geo from 'assets/maps/geo.json';
import geoValues from 'assets/maps/geo-values.json';

type Coordinate = [number, number][][];
type Property = Record<string, string | number>;
type Geometry = {
  type: string;
  coordinates: Coordinate[];
};
type Feature = {
  type: string;
  properties: Property;
  geometry: Geometry;
};

type CRSProperty = Record<string, string>;

type CRS = {
  type: string;
  properties: CRSProperty;
};

type FeatureCollection = {
  type: string;
  name: string;
  crs: CRS;
  features: Feature[];
};

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export function getFeatureCollection(
  features: Feature[],
  name: string,
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    name,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features,
  };
}

export function getSData() {
  const features = geo.map((f) => ({
    type: 'Feature',
    properties: { name: f[0] as number },
    geometry: {
      type: 'Polygon',
      coordinates: [f[1]] as any,
    },
  }));
  return getFeatureCollection(features, 'Seongnam');
}

export function getValues() {
  return geoValues.map((g) => ({ name: g[0], value: g[1] }));
}
