const axios = require('axios');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [ GatewayIntentBits.Guilds ]
});

const token = process.env.ClientToken;
const serverID = '101752';

function EditActivity(message, status) {
  client.user.setPresence({
    activities: [
      {
        name: "Players",
        type: ActivityType.Custom,
        state: message
      }
    ],
    status: status
  });
}

async function GetServerData() {
  try {
    const response = await axios.get(`https://api.scplist.kr/api/servers/${serverID}`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching server data:', error);
    return null;
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    try {
      const data = await GetServerData();
      
      if (!data)
        throw new Error("Failed to fetch server data");

      if (!data.online)
        throw new Error("Server is offline");

      if (!data.players)
        throw new Error("Player count unavailable");

      var [currentPlayers, maxPlayers] = data.players.split("/");

      EditActivity(`${currentPlayers} / ${maxPlayers} online`, currentPlayers == 0 ? "idle" : "online");
    }
    catch (error) {
      return EditActivity(error.message, "dnd");
    }
  }, 60000);
});

client.login(token);