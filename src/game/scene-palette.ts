// Scene materials share the semantic palette defined in global CSS.
export const SCENE_ROLES = [
  "sky",
  "grass",
  "wall",
  "wood",
  "wood-light",
  "wood-dark",
  "tile",
  "tile-alt",
  "carpet",
  "carpet-alt",
  "coral",
  "coral-dark",
  "cyan",
  "emerald",
  "yellow",
  "blue",
  "ink",
  "white",
  "silver",
  "hover",
  "selected",
] as const;

export type SceneRole = (typeof SCENE_ROLES)[number];

// Every role always resolves to a concrete color, so 3D props never receive undefined.
export type ScenePalette = Record<SceneRole, string>;

export function readScenePalette(): ScenePalette {
  const styles = getComputedStyle(document.documentElement);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d");
  const palette = {} as ScenePalette;
  for (const role of SCENE_ROLES) {
    const value = styles.getPropertyValue(`--scene-${role}`).trim() || "#808080";
    if (!context) {
      palette[role] = value;
      continue;
    }
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const pixel = context.getImageData(0, 0, 1, 1).data;
    palette[role] = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  }
  return palette;
}
