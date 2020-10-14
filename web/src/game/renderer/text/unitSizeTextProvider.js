import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';

export default function(game) {
  return () => {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'unit-size: ' + game.size.unit;
  };
}