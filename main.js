const axios = require('axios');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const token = process.env.ClientToken;
const serverID = '101752';

async function GetServerData() {
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
    const data = await GetServerData();
      
    if (!data.online)
      return client.user.setActivity(`Server is offline`, ActivityType.Custom);

    if (!data || !data.players)
      return client.user.setActivity(`Player count unavailable`, ActivityType.Custom);

    var [currentPlayers, maxPlayers] = data.players.split("/");

    client.user.setActivity(`${currentPlayers} / ${maxPlayers} online`, ActivityType.Custom);
  }, 60000);
});

client.login(token);