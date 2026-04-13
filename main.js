const { Client, ActivityType } = require('discord.js');
const client = new Client();
const axios = require('axios');

const token = process.env.ClientToken;
const serverID = '101752';

async function GetPlayerCount() {
  try {
    const response = await axios.get(`https://api.scplist.kr/api/servers/${serverID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server data:', error);
    return null;
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    const data = await GetPlayerCount();
      
    if (!data || !data.players)
      return client.user.setActivity(`Player count unavailable`, ActivityType.Custom);

    client.user.setActivity(`${data.players} online`, ActivityType.Custom);
  }, 60000);
});

client.login(token);