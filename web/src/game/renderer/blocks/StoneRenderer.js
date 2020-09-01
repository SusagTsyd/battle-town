import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class StoneRenderer extends BlockRenderer {

  constructor(ctx, world, sprites) {
    super(ctx, world, BlockType.STONE, sprites.stone);
  }

}
