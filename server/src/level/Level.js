import * as Block from '../../../lib/src/tanks/lib/data/entity/Block.js';
import {BlockType} from '../../../lib/src/tanks/lib/data/entity/BlockType.js';
import Point from '../../../lib/src/tanks/lib/data/primitives/Point.js';
import {SETTINGS} from '../../../lib/src/tanks/lib/util/dotenv.js';
import * as rand from '../../../lib/src/tanks/lib/util/rand.js';

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

const FFA_LEVEL = `
1111111111111111111111111
1000000020002444200000201
1223222023202242202220201
1033302013200000003300101
1023100013201220201101101
1020110220002000202000001
1020004400200020244002221
1000024412201123044203201
1211022004400133022203301
1442020024420002004402201
1440440220110221024400221
1020441100004400022020001
1022233442224420002022201
1004432440020220144044001
1224422022010330244144221
1022024420010220202102201
1000004420000200202000001
1111111111111111111111111
`;

const WIDTH = 25;
const HEIGHT = 18;

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

function brickSubtype(dx, dy) {
  if (dx % 2 === 0 && dy % 2 === 0) {
    return BlockType.BRICK_TL;
  } else if (dx % 2 !== 0 && dy % 2 === 0) {
    return BlockType.BRICK_TR;
  } else if (dx % 2 === 0 && dy % 2 !== 0) {
    return BlockType.BRICK_BL;
  } else if (dx % 2 !== 0 && dy % 2 !== 0) {
    return BlockType.BRICK_BR;
  }
}

const BLOCKS_PER_CELL = 1;
const BLOCK_SIZE = 4;
const BRICKS_PER_CELL = 4;
const BRICK_SIZE = BLOCK_SIZE / BRICKS_PER_CELL;

function iterate(levelDef, cb) {
  levelDef.trim().split('\n').forEach((row, y) => {
    row.trim().split('').forEach((cell, x) => {
      cb(x * BLOCKS_PER_CELL * BLOCK_SIZE, y * BLOCKS_PER_CELL * BLOCK_SIZE, cell);
    });
  });
}

function blockId(point) {
  return `(${point.x};${point.y})`;
}

function createLevel(levelDef) {
  const blocks = [];

  iterate(levelDef, (x, y, cell) => {
    /** @type {BlockType} */
    const blockType = parseInt(cell);

    for (let block of createBlocksForPoint(Point.create(x, y), blockType)) {
      blocks.push(block);
    }
  });

  return blocks;
}

function createBlocksForPoint(start, blockType) {
  const x = start.x;
  const y = start.y;

  if (blockType === BlockType.EMPTY) {
    return [];
  }

  if (blockType === BlockType.SPAWN) {
    return [Block.create(blockId(start), start, blockType, BLOCK_SIZE)];
  }

  if (blockType === BlockType.BRICK) {
    const result = [];
    for (let dx = 0; dx < BRICKS_PER_CELL; dx++) {
      for (let dy = 0; dy < BRICKS_PER_CELL; dy++) {
        const point = Point.create(x + dx * BRICK_SIZE, y + dy * BRICK_SIZE);
        result.push(Block.create(blockId(point), point, brickSubtype(dx, dy), BRICK_SIZE));
      }
    }
    return result;
  }

  const result = []
  for (let dx = 0; dx < BLOCKS_PER_CELL; dx++) {
    for (let dy = 0; dy < BLOCKS_PER_CELL; dy++) {
      const point = Point.create(x + dx, y + dy);
      result.push(Block.create(blockId(point), point, blockType, BLOCK_SIZE));
    }
  }
  return result;
}


export default {
  choose: () => {
    return rand.randomInt(0, LEVELS.length - 1)
  },

  generate: levelId => {
    return createLevel(getLevel(levelId));
  },

  ffa: () => {
    if (SETTINGS.USE_LEVEL === -1) {
      return createLevel(DEBUG_LEVEL);
    }
    return createLevel(FFA_LEVEL)
  },

  BLOCK_SIZE,

  WIDTH: WIDTH * BLOCKS_PER_CELL * BLOCK_SIZE,
  HEIGHT: HEIGHT * BLOCKS_PER_CELL * BLOCK_SIZE,

  createBlocksForPoint,

};
