import { ElementLayout } from "../types/dragdropcontext-types";

export function isInside(elementLayout: ElementLayout, zoneLayout: ElementLayout): boolean {

    return (elementLayout.x >= zoneLayout.x &&
        elementLayout.x <= zoneLayout.x + zoneLayout.width &&
        elementLayout.y >= zoneLayout.y &&
        elementLayout.y <= zoneLayout.y + zoneLayout.height) ||
      (elementLayout.x + elementLayout.width >= zoneLayout.x &&
        elementLayout.x + elementLayout.width <= zoneLayout.x + zoneLayout.width &&
        elementLayout.y >= zoneLayout.y &&
        elementLayout.y <= zoneLayout.y + zoneLayout.height) ||
      (elementLayout.x >= zoneLayout.x &&
        elementLayout.x <= zoneLayout.x + zoneLayout.width &&
        elementLayout.y + elementLayout.height >= zoneLayout.y &&
        elementLayout.y + elementLayout.height <= zoneLayout.y + zoneLayout.height) ||
        elementLayout.x + elementLayout.width <= zoneLayout.x + zoneLayout.width &&
      (elementLayout.x + elementLayout.width >= zoneLayout.x &&
        elementLayout.y + elementLayout.height >= zoneLayout.y &&
        elementLayout.y + elementLayout.height <= zoneLayout.y + zoneLayout.height);
}

export function findCloser(elementLayout: ElementLayout, zoneLayout1: ElementLayout, zoneLayout2: ElementLayout) {
  const elementCenterX = elementLayout.x + elementLayout.width / 2;
  const elementCenterY = elementLayout.y + elementLayout.height / 2;

  const zone1CenterX = zoneLayout1.x + zoneLayout1.width / 2;
  const zone1CenterY = zoneLayout1.y + zoneLayout1.height / 2;

  const zone2CenterX = zoneLayout2.x + zoneLayout2.width / 2;
  const zone2CenterY = zoneLayout2.y + zoneLayout2.height / 2;

  const distanceToZone1 = Math.sqrt((elementCenterX - zone1CenterX) ** 2 + (elementCenterY - zone1CenterY) ** 2);
  const distanceToZone2 = Math.sqrt((elementCenterX - zone2CenterX) ** 2 + (elementCenterY - zone2CenterY) ** 2);

  return distanceToZone1 < distanceToZone2 ? zoneLayout1 : zoneLayout2;
}