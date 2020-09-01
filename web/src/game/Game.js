import Tank from '../../../lib/src/Tank.js';
import TankMove from '../../../lib/src/TankMove.js';
import World from '../../../lib/src/World.js';
import BrickRenderer from './renderer/blocks/BrickRenderer.js';
import JungleRenderer from './renderer/blocks/JungleRenderer.js';
import StoneRenderer from './renderer/blocks/StoneRenderer.js';
import WaterRenderer from './renderer/blocks/WaterRenderer.js';
import BulletRenderer from './renderer/BulletRenderer.js';
import PingRenderer from './renderer/PingRenderer.js';
import TankRenderer from './renderer/TankRenderer.js';
import FpsRenderer from './renderer/FpsRenderer.js';
import ScoreRenderer from './renderer/ScoreRenderer.js';

export default class Game {

  constructor(ctx, client, sprites, conf) {
    this.ctx = ctx;
    this.world = World.create(conf.world);
    this.client = client;

    this.tank = Tank.create(conf.tank);
    this.world.addTank(this.tank);

    this.ticks = [
      this.world,
      new StoneRenderer(ctx, this.world, sprites),
      new BrickRenderer(ctx, this.world, sprites),
      new WaterRenderer(ctx, this.world, sprites),
      new BulletRenderer(ctx, this.world, sprites),
      new TankRenderer(ctx, this.world, sprites),
      new JungleRenderer(ctx, this.world, sprites),
      new PingRenderer(ctx, this.client),
      new FpsRenderer(ctx),
      new ScoreRenderer(ctx, this.world)
    ];
  }

  update(event) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ticks.forEach(tick => tick.update(event));
  }

  startMoving(direction) {
    this.onStartMoving(new TankMove(this.tank.id, direction));
    this.client.startMoving(direction);
  }

  onStartMoving(data) {
    const tankMove = TankMove.create(data);
    this.world.startMoving(tankMove.id, tankMove.direction, tankMove.position);
  }

  onStopMoving(data) {
    const tankMove = TankMove.create(data);
    this.world.stopMoving(tankMove.id, tankMove.position);
  }

  shoot() {
    this.onShoot(this.tank.id);
    this.client.shoot();
  }

  onShoot(id, position) {
    this.world.shoot(id, position);
  }

  onConnected(data) {
    const tank = Tank.create(data);
    this.world.addTank(tank);

    if (tank.id === this.tank.id) {
      this.tank = tank;
    }
  }

  onDisconnected(id) {
    this.world.removeTank(id, true);
  }

  onKilled(tank) {
    this.world.removeTank(tank.id, false);
  }

  onScore(score) {
    this.world.score = score;
  }

  onBulletExploded(id) {
    this.world.removeBullet(id);
  }

  onSync(data) {
    const newWorld = World.create(data);
    this.world.sync(newWorld);
  }

  stop() {
  }

}
