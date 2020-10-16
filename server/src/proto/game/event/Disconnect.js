import {copy} from '../../../../../lib/src/tanks/lib/util/immutable.js';
import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function(player) {
  return copy(RoomEvent(RoomEventType.DISCONNECT), {
    player,
  });
}
