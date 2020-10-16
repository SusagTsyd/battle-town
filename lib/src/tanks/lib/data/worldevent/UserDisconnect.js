import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(id) {
  return WorldEvent(WorldEventType.USER_DISCONNECT, { id });
}