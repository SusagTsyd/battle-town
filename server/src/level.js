import Block from '../../lib/src/data/Block.js';
import BlockType from '../../lib/src/data/BlockType.js';
import Point from '../../lib/src/data/Point.js';
import randomInt from '../../lib/src/util/randomInt.js';
import {SETTINGS} from '../../lib/src/util/dotenv.js';

const DEBUG_LEVEL = `
1111111111111111111111111
1000000000000000000000001
1050050000000000000000001
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

const LEVELS = [
  `
    1111111111111111111111111
    1010000000202020002020151
    1010222222202020222020101
    1010200000202000202020101
    1010202020202220202000101
    1010202024244422202020101
    1010202024222444002020101
    1010002024442422222020101
    1000222022224424000020001
    1000200004244222202220001
    1010202222242444202000101
    1010202004442224202020101
    1010202022244424202020101
    1010002020222020202020101
    1010202020002020000020101
    1010202220202022222220101
    1510202000202020000000101
    1111111111111111111111111
  `,
  `
    1111111111111111111111111
    1010000000443440000000151
    1010111110443440111110101
    1010000010444440100000101
    1010201010444440101020101
    1010201000443440001020101
    1010201100443440011020101
    1010200001443441000020101
    1000222201444441022220001
    1000222201444441022220001
    1010200001443441000020101
    1010201100443440011020101
    1010201000443440001020101
    1010201010444440101000101
    1010000010444440100000101
    1010111110443440111110101
    1510000000443440000000101
    1111111111111111111111111
  `,
  `
    1111111111111111111111111
    1020030000030000030000251
    1020000030000030000030201
    1020111030111030111030201
    1020000030000030000030201
    1020030000030000030000201
    1021030111030111030111201
    1020030000030000030000201
    1000000030000030000030001
    1000111030111030111030001
    1020000030000030000030201
    1020030000030000030000201
    1021030111030111030111201
    1020030000030000030000201
    1020000030000030000030201
    1020111030111030111030201
    1520000030000030000030201
    1111111111111111111111111
  `
];

function getLevel(levelId) {
  if (SETTINGS.USE_LEVEL === -1) {
    return DEBUG_LEVEL;
  }

  if (SETTINGS.USE_LEVEL === null) {
    return LEVELS[levelId];
  }

  return LEVELS[SETTINGS.USE_LEVEL];
}

const BLOCKS_PER_CELL = 2;

export default Object.freeze({
  choose: () => {
    return randomInt(0, LEVELS.length - 1)
  },

  generate: levelId => {
    const blocks = [];

    const level = getLevel(levelId);

    let blockId = 0;

    const getBlockId = () => blockId++;

    level.trim().split('\n').forEach((row, y) => {
      row.trim().split('').forEach((cell, x) => {
        const blockType = parseInt(cell);

        if (blockType === BlockType.EMPTY) {
          return;
        }

        if (blockType === BlockType.SPAWN) {
          const point = new Point(x * BLOCKS_PER_CELL, y * BLOCKS_PER_CELL);
          blocks.push(new Block(getBlockId(), point, blockType));
          return;
        }

        for (let dx = 0; dx < BLOCKS_PER_CELL; dx++) {
          for (let dy = 0; dy < BLOCKS_PER_CELL; dy++) {
            const point = new Point(x * BLOCKS_PER_CELL + dx, y * BLOCKS_PER_CELL + dy);
            blocks.push(new Block(getBlockId(), point, blockType));
          }
        }
      });
    });

    return blocks;
  },
});
