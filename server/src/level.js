import Block from '../../lib/src/Block.js';
import BlockType from '../../lib/src/BlockType.js';
import Point from '../../lib/src/Point.js';

const level = `
1111111111111111111111111
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1000000222222200000000001
1000000200000200033330001
1000000202220200044440001
1000000202020200044440001
1000000202000200011110001
1000000202222200000000001
1000000200000000000000001
1000000222222200000000001
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1111111111111111111111111
`;

const BLOCKS_PER_CELL = 2;

export default function initLevel() {
  const blocks = [];
  level.trim().split('\n').forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      const blockType = parseInt(cell);

      if (blockType === BlockType.EMPTY) {
        return;
      }

      for (let dx = 0; dx < BLOCKS_PER_CELL; dx++) {
        for (let dy = 0; dy < BLOCKS_PER_CELL; dy++) {
          const point = new Point(x * BLOCKS_PER_CELL + dx, y * BLOCKS_PER_CELL + dy);
          blocks.push(new Block(point, blockType));
        }
      }
    });
  });

  return blocks;
}
