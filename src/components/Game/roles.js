// src/components/Game/roles.js
const ROLES = [
  "Ma Sói",
  "Dân làng",
  "Tiên tri",
  "Bảo vệ",
  "Phù thủy",
  // Thêm vai trò khác nếu cần
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// src/components/Game/roles.js
export const assignRoles = (players) => {
  const playerIds = Object.keys(players);
  const playerCount = playerIds.length;
  let roles = [];

  if (playerCount < 8) {
    roles = Array(playerCount).fill("Dân làng");
  } else {
    roles = [
      "Tiên tri",
      "Bảo vệ",
      "Ma Sói",
      "Ma Sói",
      "Dân làng",
      "Dân làng",
      "Dân làng",
      "Dân làng",
    ];
    if (playerCount >= 9) {
      roles.push("Phù thủy");
    }
    if (playerCount >= 10) {
      roles.push("Ma Sói");
    }
    if (playerCount >= 11) {
      roles.push("Ngố");
    }
    if (playerCount >= 12) {
      roles.push("Dân làng");
    }
    if (playerCount >= 13) {
      roles.push("Dân làng");
    }
    if (playerCount >= 14) {
      roles.push("Ma Sói");
    }
    if (playerCount >= 15) {
      roles.push("Dân làng");
    }
    if (playerCount >= 16) {
      roles.push("Ma Sói");
    }
  }

  const assignedRoles = {};
  for (let i = 0; i < playerIds.length; i++) {
    const randomIndex = Math.floor(Math.random() * roles.length);
    assignedRoles[playerIds[i]] = roles[randomIndex];
    roles.splice(randomIndex, 1);
  }

  return assignedRoles;
};
