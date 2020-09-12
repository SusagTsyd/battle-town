import {renderText} from './text.js';
import Ticker, {FPS} from '../../../../lib/src/Ticker.js';
import MatchState from '../../../../lib/src/data/MatchState.js';
import Match from '../../../../lib/src/data/Match.js';

export default class MatchStateRenderer {

  constructor(ctx, match, position) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
  }

  update() {
    const text = this.createText();

    if (!text) {
      return;
    }

    renderText(this.ctx, text, this.position.x, this.position.y, {
      size: 60,
      center: true,
      stroke: true,
      bg: 'rgba(0, 0, 0, 0.8)'
    });
  }

  createText() {
    const match = this.match;
    const state = match.state;
    const tick = match.tick;
    const stateSinceTick = match.stateSinceTick;
    const stateTicks = tick - stateSinceTick;
    const nextStateOnTick = match.nextStateOnTick;
    const spotlight = Match.findUser(match, match.stateSpotlight);

    const countdown = Ticker.countdown(tick, nextStateOnTick);

    switch (state) {
      case MatchState.PREPARE:
        return `Get ready ${'.'.repeat(countdown)}`;
      case MatchState.READY:
        return `${countdown}`;
      case MatchState.PLAY:
        if (stateTicks > FPS) {
          return null;
        } else {
          return 'GO';
        }
      case MatchState.SCORE:
        return `${spotlight.name} scored`;
      case MatchState.FINISHED:
        return `${spotlight.name} won`;
      default:
        return `${state}: ${countdown}`;
    }
  }

}
