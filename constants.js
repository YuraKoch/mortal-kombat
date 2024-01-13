export const PLAYER_BOTTOM = 360;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 130;

export const ARENA = {
  WIDTH: 600,
  HEIGHT: 400
};

export const MOVE_TYPES = {
  STAND: 'stand',
  WALK: 'walk',
  WALK_BACKWARD: 'walk-backward',
  SQUAT: 'squat',
  STAND_UP: 'stand-up',
  BLOCK: 'block',
  JUMP: 'jump',
  FORWARD_JUMP: 'forward-jump',
  BACKWARD_JUMP: 'backward-jump',
  ENDURE: 'endure',
  SQUAT_ENDURE: 'squat-endure',
  KNOCK_DOWN: 'knock-down',
  ATTRACTIVE_STAND_UP: 'attractive-stand-up',
  FALL: 'fall',
  WIN: 'win',
  HIGH_KICK: 'high-kick',
  LOW_KICK: 'low-kick',
  LOW_PUNCH: 'low-punch',
  HIGH_PUNCH: 'high-punch',
  UPPERCUT: 'uppercut',
  SQUAT_LOW_KICK: 'squat-low-kick',
  SQUAT_HIGH_KICK: 'squat-high-kick',
  SQUAT_LOW_PUNCH: 'squat-low-punch',
  SPIN_KICK: 'spin-kick',
  FORWARD_JUMP_KICK: 'forward-jump-kick',
  BACKWARD_JUMP_KICK: 'backward-jump-kick',
  BACKWARD_JUMP_PUNCH: 'backward-jump-punch',
  FORWARD_JUMP_PUNCH: 'forward-jump-punch'
};

export const IMAGE_COUNT_BY_MOVE_TYPE = {
  [MOVE_TYPES.STAND]: 9,
  [MOVE_TYPES.WALK]: 9,
  [MOVE_TYPES.WALK_BACKWARD]: 9,
  [MOVE_TYPES.SQUAT]: 3,
  [MOVE_TYPES.STAND_UP]: 3,
  [MOVE_TYPES.BLOCK]: 3,
  [MOVE_TYPES.JUMP]: 8,
  [MOVE_TYPES.FORWARD_JUMP]: 8,
  [MOVE_TYPES.BACKWARD_JUMP]: 8,
  [MOVE_TYPES.ENDURE]: 3,
  [MOVE_TYPES.SQUAT_ENDURE]: 3,
  [MOVE_TYPES.KNOCK_DOWN]: 10,
  [MOVE_TYPES.ATTRACTIVE_STAND_UP]: 4,
  [MOVE_TYPES.FALL]: 7,
  [MOVE_TYPES.WIN]: 10,
  [MOVE_TYPES.HIGH_KICK]: 13,
  [MOVE_TYPES.LOW_KICK]: 11,
  [MOVE_TYPES.HIGH_PUNCH]: 8,
  [MOVE_TYPES.LOW_PUNCH]: 6,
  [MOVE_TYPES.UPPERCUT]: 9,
  [MOVE_TYPES.SQUAT_LOW_KICK]: 5,
  [MOVE_TYPES.SQUAT_HIGH_KICK]: 7,
  [MOVE_TYPES.SQUAT_LOW_PUNCH]: 5,
  [MOVE_TYPES.SPIN_KICK]: 8,
  [MOVE_TYPES.FORWARD_JUMP_KICK]: 3,
  [MOVE_TYPES.BACKWARD_JUMP_KICK]: 3,
  [MOVE_TYPES.BACKWARD_JUMP_PUNCH]: 3,
  [MOVE_TYPES.FORWARD_JUMP_PUNCH]: 3,
};

export const ORIENTATIONS = {
  LEFT: 'left',
  RIGHT: 'right'
};

export const KEYS = [
  {
    UP: 'KeyW',
    DOWN: 'KeyS',
    LEFT: 'KeyA',
    RIGHT: 'KeyD',
    BLOCK: 'ShiftLeft',
    HP: 'KeyR',
    HK: 'KeyT',
    LP: 'KeyF',
    LK: 'KeyG'
  },
  {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    BLOCK: 'ShiftRight',
    HP: 'KeyI',
    HK: 'KeyO',
    LP: 'KeyK',
    LK: 'KeyL'
  }
];