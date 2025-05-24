const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0JCYk1tZVd0VkJweGtVNlFtaGM5UE9IeWtncERaOVdlR2hkQWxLd1IyVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiampwbDVpci9UcG9iWTRXanJYdXJMVmtSVUd1VjB4NGZzS2x2b3ZULzJ3VT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwRE1KNE1aeU5YRWxuT21sa1VxbnNLQ1plMFZYS3l3WE1TQmR3bTlqQmxzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2cjJNMW16UUhiWFMyNG9zeUxxbnJEWVAxVkJUeS9mZk1pVGMvTDlKZ1dnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNFa3FSMHl2M2ZxSndUMkVXN2NDMktSa3RSTm9abm5nOUlBOTBDWUJYMkE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVMN0FaMUV3ekZMaXQwcEQxeHNjSTNLRWJReEpJYk5uSS9xeEwyNGF1akE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUhrcnFOc0lVdzlwTkNLQ2k1OVd3ZTFCdUtLY1loQUdNZU02ejdSSGJIdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL3lhWWUwUy9qbFA4bDhUQ3pCcjNSdnVsZlpUQ1hCQ1RxWXZlaStYbGYxST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFqdDNETmdmVGFNREZhV0M0ZGx2bTBqaFdycC9KUkMxWHdDSjMyME9TUU9hS0YzaW1DTEQ5UXYzT2hPQytWelpJeGl3RXZIaFRPVWtQN09vQTNEY0J3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTMxLCJhZHZTZWNyZXRLZXkiOiJsWkRjNGFzNmpNMktHNkdhNUkrckdDRnJhbE1hRkZqTFJSRjNKcGF1WDVrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJuMFdoZnBCYVR4V0FoRlNhTWFkWm93IiwicGhvbmVJZCI6Ijk3NjkxNjkxLWU0ZjItNDAwYy05YWMyLWM4NzRlODdjYjY0ZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFYmNnS1lONE8vWjUvTDVENkJ0ZkVRUmJjMlE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlIyd3ZtbTROMVZVWVQyOStJTG5ibkJWcHhzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlRPWElDVEVDIiwibWUiOnsiaWQiOiIyMDEwMDgyMjM3ODk6OEBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLZg9mI2YPYqCDYp9mE2KfYtdmE2YoiLCJsaWQiOiIyNTQ2ODc4MDI1OTM0NTY6OEBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xybnRZb0RFTGFEeU1FR0dBUWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6ImZKeWUwWkJYVGcyZjJVRTFoSzZ2YnQ4Qkt5U3pxREc2bmlxNzlxZnp5bGc9IiwiYWNjb3VudFNpZ25hdHVyZSI6Imxhd0lCTnVsV0pEbE9BSVZ3dTd5LzUyb0pRVFFISXoxY2RqWTh6ZU9kR0R0UzJ3VDM2bjM2SDNVTWFoUVRVSlRiNWE0Njl3bzVhK2xtcDhlVklXU0FRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJsdFFXUzFHNWdwSDY2YlhaUkIxWU5PRHVnUjRVR1RtSHMydTFsb2NtSklreEo4OFRneXZlSm1wTXMvUkhIU2hkMGpUSGhhai9qd1QwSHBJQmZhMmlCUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIwMTAwODIyMzc4OTo4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlh5Y250R1FWMDRObjlsQk5ZU3VyMjdmQVNza3M2Z3h1cDRxdS9hbjg4cFkifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElFZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0ODEwNzcxNiwibGFzdFByb3BIYXNoIjoiMlY3N3FVIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFHOEUifQ==',
    PREFIXE: process.env.PREFIX || "",
    OWNER_NAME: process.env.OWNER_NAME || "Njabulo J ",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "26777821911",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",       
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "yes",                     
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'Tox-md',
    URL : process.env.BOT_MENU_LINKS || 'https://i.ibb.co/mChCjFPL/ad76194e124ff34e.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
