const moment = require('moment')
const TicketGenerator = require('./ticket-generator')
const { Ticket } = require('./models')

function init(config) {
  TicketGenerator.init(config)
}

async function refresh(unrecognizedHistory, markRecognized) {
  console.log('[+] checking bank payments')
  const activeTickets = await Ticket.find({ active: true, paid: false })

  unrecognizedHistory.forEach(async record => {
    console.log('[+] finding ticket for ' + record.amount)
    const matchedTicket = activeTickets.find(t => t.amount == record.amount)
    if (matchedTicket != null) {
      console.log('[+] found ticket for ' + record.amount)
      console.log('[+] updating ticket for ' + record.amount)
      matchedTicket.paid = true
      matchedTicket.active = false
      matchedTicket.paymentTime = moment()
      await matchedTicket.save()
      await markRecognized(record._id)
      console.log('[+] updated ticket for ' + record.amount)
    }
  });
  console.log('[+] checked bank payments')
}

async function get(id) {
  return Ticket.findById(id)
}

async function create(amount) {
  const ticket = await TicketGenerator.generateNewTicket(amount)
  console.log('[+] created ticket: ', ticket)
  return ticket
}

async function markPaid(id) {
  console.log('[+] marked ticket paid: ' + id)
  const ticket = await Ticket.findById(id)
  ticket.paid = true
  ticket.active = false
  ticket.paymentTime = moment()
  return ticket.save()
}

module.exports = { init, refresh, get, create, markPaid }
