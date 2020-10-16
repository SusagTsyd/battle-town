import { copy } from '../../util/immutable.js';
import * as Direction from '../primitives/Direction.js';
import { DirectionType } from '../primitives/DirectionType.js';
import Point from '../primitives/Point.js';
import * as Entity from './Entity.js';
import { EntityType } from './EntityType.js';

/**
 * @typedef {Entity} BulletOnly
 * @property {Direction} direction
 *
 * @typedef {Entity & BulletOnly} Bullet
 */

const BULLET_SPEED = 0.03;

/**
 *
 *
 * @param {Tank} tank
 * @param {Direction} direction
 * @returns {Point}
 */
function bulletPosition(tank, direction) {
  switch (direction) {
    case Direction.Direction.UP:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.DOWN:
      return Point.create(tank.position.x, tank.position.y + tank.size - size() / 2);
    case Direction.Direction.LEFT:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.RIGHT:
      return Point.create(tank.position.x + tank.size - size() / 2, tank.position.y);
    default:
      throw new Error('Unknown direction ' + direction);
  }
}

/**
 *
 * @param {string} id
 * @param {Direction} direction
 * @param {Point} position
 * @returns {Bullet}
 */
export function create(id, direction, position) {
  const entity = Entity.create(id, EntityType.BULLET, position, size())

  let height;
  let width;
  if (Direction.type(direction) === DirectionType.HORIZONTAL) {
    height = entity.height * 2;
    width = entity.width / 2;
  } else {
    height = entity.height / 2;
    width = entity.width * 2;
  }

  return copy(entity, {
    direction,
    height,
    width
  });
}

/**
 *
 * @returns {number}
 */
export function size() {
  return 2;
}

/**
 *
 * @param {string} id
 * @param {Direction} direction
 * @param {Tank} tank
 * @returns {Bullet}
 */
export function fromTank(id, direction, tank) {
  return create(
    id,
    direction,
    bulletPosition(tank, direction)
  );
}

/**
 *
 * @param {Bullet} bullet
 * @param event
 * @returns {Bullet}
 */
export function update(bullet, event) {
  const delta = event.delta;
  return setPosition(bullet, Point.move(bullet.position, bullet.direction, delta * BULLET_SPEED));
}

/**
 *
 * @param {Bullet} bullet
 * @param {Point} position
 * @returns {Bullet}
 */
export function setPosition(bullet, position) {
  return copy(bullet, { position });
}