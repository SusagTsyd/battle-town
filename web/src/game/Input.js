import * as Direction from '../../../lib/src/data/Direction.js';
import * as Point from '../../../lib/src/data/Point.js';

function positionToDirection(original, touch) {
  const dx = touch.pageX - original.x;
  const dy = touch.pageY - original.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if (adx > ady && dx > 0) {
    return Direction.Direction.RIGHT;
  } else if (adx > ady && dx < 0) {
    return Direction.Direction.LEFT;
  } else if (ady > adx && dy > 0) {
    return Direction.Direction.DOWN;
  } else if (ady > adx && dy < 0) {
    return Direction.Direction.UP;
  }

  return null;
}

export default class Input {

  constructor(game) {
    this.game = game;

    this.movingTouch = null;
    this.movingPos = null;
  }

  keydown(event) {
    event.preventDefault();

    const direction = this.keyToDirection(event.code);
    if (direction !== null) {
      this.game.startMoving(direction);
      return;
    }

    switch (event.code) {
      case 'Space':
      case 'KeyK':
        this.game.shoot();
        break;
    }
  }

  keyup(event) {
    event.preventDefault();

    if (!this.game.moving) {
      return;
    }

    if (this.game.direction !== this.keyToDirection(event.code)) {
      return;
    }

    this.game.stopMoving();
  }

  handleTouches(touches) {
    let stillMoving = false;
    for (let touch of touches) {
      if (touch.pageX < (window.innerWidth / 2) && this.movingTouch === null) {
        this.movingTouch = touch.identifier;
        this.movingPos = Point.create(touch.pageX, touch.pageY);
        stillMoving = true;
        continue;
      }

      if (this.movingTouch === touch.identifier) {
        stillMoving = true;
        const direction = positionToDirection(this.movingPos, touch);
        if (direction !== null) {
          this.game.startMoving(direction);
        }
      }

      if (touch.pageX > (window.innerWidth / 2)) {
        this.game.shoot();
      }
    }

    if (!stillMoving) {
      this.movingPos = null;
      this.movingTouch = null;
      this.game.stopMoving();
    }
  }

  touchstart(event) {
    this.handleTouches(event.touches);
  }

  touchmove(event) {
    this.handleTouches(event.touches);
  }

  touchend(event) {
    this.handleTouches(event.touches);
  }

  touchcancel(event) {
    this.handleTouches(event.touches);
  }

  keyToDirection(keyCode) {
    switch (keyCode) {
      case 'ArrowUp':
      case 'KeyW':
        return Direction.Direction.UP;
      case 'ArrowDown':
      case 'KeyS':
        return Direction.Direction.DOWN;
      case 'ArrowLeft':
      case 'KeyA':
        return Direction.Direction.LEFT;
      case 'ArrowRight':
      case 'KeyD':
        return Direction.Direction.RIGHT;
    }

    return null;
  }

}
