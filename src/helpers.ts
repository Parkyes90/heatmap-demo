const COORD = [
  [127.05726405974522, 37.39080929126367],
  [127.05781961530079, 37.39080929126367],
  [127.05781961530079, 37.39035474580913],
  [127.05726405974522, 37.39035474580913],
];

const TYPE = [0, COORD];
type Property = Record<string, string | number>;
type Geometry = {
  type: string;
  coordinates: typeof COORD[];
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

export function getSData(geo: typeof TYPE[]) {
  const features = geo.map((f) => ({
    type: 'Feature',
    properties: { name: f[0] },
    geometry: {
      type: 'Polygon',
      coordinates: [f[1]],
    },
  }));
  return getFeatureCollection(features as any, 'Seongnam');
}

export function getValues(values: [number, number][]) {
  return values.map((g) => ({ name: g[0], value: g[1] }));
}
