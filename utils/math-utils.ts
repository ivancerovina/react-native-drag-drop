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
      (elementLayout.x + elementLayout.width >= zoneLayout.x &&
        elementLayout.x + elementLayout.width <= zoneLayout.x + zoneLayout.width &&
        elementLayout.y + elementLayout.height >= zoneLayout.y &&
        elementLayout.y + elementLayout.height <= zoneLayout.y + zoneLayout.height);
}