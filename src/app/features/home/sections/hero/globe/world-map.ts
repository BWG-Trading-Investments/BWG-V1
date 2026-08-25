/**
 * A coarse world landmask, and the sampling helpers that turn it into dots.
 *
 * Shared by both globes so the WebGL version and the SVG fallback draw the same
 * continents from the same data — the fallback is meant to match, not merely to
 * gesture at, the real thing.
 *
 * The mask is expressed as data rather than an image because the hero is not
 * allowed to load any raster asset, and because 36 rows of longitude spans is
 * small enough to read and correct by hand.
 *
 * Resolution is 5° of latitude per band. Each band lists the longitude spans
 * that are land at that latitude, in degrees, west-negative. It is deliberately
 * approximate: at the dot sizes used here, coastline detail below a few hundred
 * kilometres is invisible.
 */

type Span = readonly [number, number];

/**
 * Land spans by latitude band, north to south. Index i covers the band centred
 * on 87.5 - 5i degrees, so index 0 is the north pole and index 35 the south.
 */
const LAND_BANDS: readonly (readonly Span[])[] = [
  /* 87.5N */ [],
  /* 82.5N */ [[-105, -20], [15, 30], [50, 65], [90, 110]],
  /* 77.5N */ [[-120, -20], [10, 28], [50, 70], [88, 112], [135, 150]],
  /* 72.5N */ [[-160, -20], [15, 30], [55, 180]],
  /* 67.5N */ [[-168, -20], [-25, -13], [8, 180]],
  /* 62.5N */ [[-168, -42], [-24, -14], [4, 180]],
  /* 57.5N */ [[-168, -56], [-50, -42], [-8, -2], [4, 180]],
  /* 52.5N */ [[-180, -165], [-168, -55], [-11, 180]],
  /* 47.5N */ [[-128, -52], [-5, 150]],
  /* 42.5N */ [[-125, -68], [-10, 146]],
  /* 37.5N */ [[-124, -73], [-10, 124], [126, 142]],
  /* 32.5N */ [[-120, -76], [-10, 124], [129, 141]],
  /* 27.5N */ [[-116, -79], [-16, 58], [60, 124]],
  /* 22.5N */ [[-112, -96], [-85, -73], [-17, 56], [68, 116]],
  /* 17.5N */ [[-106, -88], [-85, -60], [-17, 56], [72, 86], [92, 110], [120, 126]],
  /* 12.5N */ [[-93, -82], [-73, -59], [-17, 52], [74, 81], [95, 108], [120, 126]],
  /*  7.5N */ [[-82, -60], [-13, 48], [79, 82], [97, 107], [120, 127]],
  /*  2.5N */ [[-79, -49], [-9, 45], [95, 120]],
  /*  2.5S */ [[-79, -44], [8, 42], [97, 120], [130, 151]],
  /*  7.5S */ [[-79, -34], [11, 41], [100, 151]],
  /* 12.5S */ [[-77, -37], [12, 41], [43, 50], [119, 146]],
  /* 17.5S */ [[-72, -38], [12, 36], [43, 50], [113, 147]],
  /* 22.5S */ [[-71, -40], [13, 35], [43, 49], [113, 152]],
  /* 27.5S */ [[-72, -47], [15, 33], [113, 153]],
  /* 32.5S */ [[-73, -52], [17, 32], [115, 152]],
  /* 37.5S */ [[-74, -56], [138, 150], [172, 178]],
  /* 42.5S */ [[-75, -63], [145, 149], [169, 175]],
  /* 47.5S */ [[-76, -67]],
  /* 52.5S */ [[-76, -67]],
  /* 57.5S */ [],
  /* 62.5S */ [[-62, -55]],
  /* 67.5S */ [[-130, -58], [-15, 180]],
  /* 72.5S */ [[-180, 180]],
  /* 77.5S */ [[-180, 180]],
  /* 82.5S */ [[-180, 180]],
  /* 87.5S */ [[-180, 180]],
];

const BAND_DEGREES = 5;

/** True when the given coordinate falls on land in the mask above. */
export function isLand(latitude: number, longitude: number): boolean {
  const index = Math.floor((90 - latitude) / BAND_DEGREES);
  const band = LAND_BANDS[Math.min(LAND_BANDS.length - 1, Math.max(0, index))];

  for (const [west, east] of band) {
    if (longitude >= west && longitude <= east) {
      return true;
    }
  }
  return false;
}

export interface GeoPoint {
  readonly lat: number;
  readonly lon: number;
}

/**
 * Evenly distributed points over the whole sphere, filtered down to the ones on
 * land.
 *
 * Uses a Fibonacci spiral rather than a lat/lon grid: a grid bunches points
 * tightly at the poles and leaves the equator sparse, which reads as a mistake
 * on a rotating globe. The spiral gives equal area per point.
 *
 * `samples` is the number of candidates tested, not the number returned — land
 * is roughly a third of the surface, so expect about a third back.
 */
export function sampleLandPoints(samples: number): GeoPoint[] {
  const points: GeoPoint[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < samples; i++) {
    // y walks evenly from +1 to -1; latitude follows from it.
    const y = 1 - (i / (samples - 1)) * 2;
    const lat = Math.asin(y) * (180 / Math.PI);
    const theta = golden * i;
    // Wrap into -180..180 rather than 0..360 so it matches the mask's spans.
    const lon = (((theta * (180 / Math.PI)) % 360) + 540) % 360 - 180;

    if (isLand(lat, lon)) {
      points.push({ lat, lon });
    }
  }

  return points;
}

/**
 * Latitude/longitude to a point on a sphere of the given radius.
 *
 * Y is up, matching Three.js, and the same convention is used by the SVG
 * fallback so both globes are oriented identically.
 */
export function toVector(
  latitude: number,
  longitude: number,
  radius = 1,
): { x: number; y: number; z: number } {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

/**
 * The endpoints of the network arcs, as indices into a list of land points.
 *
 * Fixed pairs of real cities rather than random points: random pairs regularly
 * produce arcs between two points in the middle of Siberia, which does not read
 * as a trade network. These are chosen to span the map.
 */
export const ARC_ROUTES: readonly (readonly [GeoPoint, GeoPoint])[] = [
  [{ lat: 30.0, lon: 31.2 }, { lat: 51.5, lon: -0.1 }], // Cairo — London
  [{ lat: 25.2, lon: 55.3 }, { lat: 1.35, lon: 103.8 }], // Dubai — Singapore
  [{ lat: 40.7, lon: -74.0 }, { lat: 48.9, lon: 2.35 }], // New York — Paris
  [{ lat: 22.3, lon: 114.2 }, { lat: -33.9, lon: 151.2 }], // Hong Kong — Sydney
  [{ lat: 30.0, lon: 31.2 }, { lat: -1.3, lon: 36.8 }], // Cairo — Nairobi
  [{ lat: 25.2, lon: 55.3 }, { lat: 19.1, lon: 72.9 }], // Dubai — Mumbai
  [{ lat: 51.5, lon: -0.1 }, { lat: -23.6, lon: -46.6 }], // London — São Paulo
  [{ lat: 35.7, lon: 139.7 }, { lat: 37.8, lon: -122.4 }], // Tokyo — San Francisco
  [{ lat: 52.4, lon: 4.9 }, { lat: 25.2, lon: 55.3 }], // Amsterdam — Dubai
  [{ lat: 1.35, lon: 103.8 }, { lat: -33.9, lon: 18.4 }], // Singapore — Cape Town
];
