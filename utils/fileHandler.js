const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

exports.readUsers = async () => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

exports.writeUsers = async (users) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};