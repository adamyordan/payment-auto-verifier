const cron = require('node-cron');
const HistoryManager = require('./history-manager')
const TicketManager = require('./ticket-manager')

function init(config) {
  if (config.cron.enabled) {
    cron.schedule(config.cron.refreshSchedule, async () => {
      console.log('[+] [CRON] Refreshing payments...');
      await HistoryManager.refresh()
      const unrecognizedHistory = await HistoryManager.getUnrecognized()
      await TicketManager.refresh(unrecognizedHistory, HistoryManager.markRecognized)
      console.log('[+] [CRON] Refreshed payments...');
    });  
  }
}

module.exports = { init }
