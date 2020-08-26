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

export default function initLevel() {
  const blocks = [];
  level.trim().split('\n').forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      const blockType = parseInt(cell);

      if (blockType === BlockType.EMPTY) {
        return;
      }

      blocks.push(new Block(new Point(x, y), blockType));
    });
  });

  return blocks;
}