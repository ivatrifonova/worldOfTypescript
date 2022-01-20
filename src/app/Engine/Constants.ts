export const constants = {
  GIANT: {
    attack: 40,
    defense: 20,
    health: 90,
    isDestroyed: false,
    canMove: true,
    canGather: true,
    endPoints: 15,
  },

  PEASANT: {
    attack: 25,
    defense: 10,
    health: 50,
    isDestroyed: false,
    canMove: true,
    canGather: true,
    endPoints: 5,
  },

  GUARD: {
    attack: 30,
    defense: 20,
    health: 80,
    isDestroyed: false,
    canMove: true,
    canGather: false,
    endPoints: 10,
  },

  NINJA: {
    attack: 50,
    defense: 10,
    health: 80,
    isDestroyed: false,
    canMove: true,
    canGather: false,
    endPoints: 15,
  },

  RESOURCE: {
    canMove: false,
    isDestroyed: false,
  },
};
