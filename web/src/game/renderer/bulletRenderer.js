import * as Bullet from '../../../../lib/src/data/entity/Bullet.js';
import * as Direction from '../../../../lib/src/data/primitives/Direction.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import helper from './helper.js';
import * as sprites from './sprites.js';
import {SPRITES} from './sprites.js';

function drawBullet(game, spritesConf, ctx, tick, bullet) {
  const gameSize = game.size;
  const position = helper.offset(bullet.position, game.ownPosition());

  if (helper.outsideVisibleBoundaries(position)) {
    return;
  }

  const x = position.x;
  const y = position.y;
  const width = bullet.width * gameSize.unit;
  const height = bullet.height * gameSize.unit
  const img = spritesConf[gameSize.unit][SPRITES.BULLET];
  const size = Bullet.size() / 2 * gameSize.unit;

  ctx.fillStyle = 'white';
  ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
  ctx.transform(1, 0, 0, 1, width / 2, height / 2);
  ctx.rotate(Direction.toRad(bullet.direction));
  ctx.transform(1, 0, 0, 1, - width / 2, - height / 2);
  sprites.draw(
    ctx,
    tick,
    img,
    Math.ceil((width - size) / 2),
    Math.ceil((height - size) / 2),
    size,
    size
  );

  if (SETTINGS.DEBUG_RENDER) {
    ctx.transform(1, 0, 0, 1, width / 2, height / 2);
    ctx.rotate(-Direction.toRad(bullet.direction));
    ctx.transform(1, 0, 0, 1, -width / 2, -height / 2);


    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(
      0,
      0,
      width,
      height
    );
  }

  ctx.resetTransform();
}


export default function (ctx, game, spritesConf) {
  return event => {
    for (let bullet of game.match.world.bullets) {
      drawBullet(game, spritesConf, ctx, event.tick, bullet);
    }
  };
}