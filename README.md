Payment Auto Verifier
===
This project contains a payment system that enable you to generate a payment ticket for your customer, and have them automatically verifed after your customer pays.


Available Bank
===
Currently supported bank(s) is:
- BTPN jenius


Requirement
===
- Node
- Mongo


Getting Started
===
Clone the project
```
git clone https://github.com/adamyordan/payment-auto-verifier.git
cd payment-auto-verifier
npm i
vim .env # set environment variables
npm start
```

Add necessary environment values in file `.env`
```
JENIUS_ENCRYPTED=false
JENIUS_EMAIL=you@mail.com
JENIUS_PASSWORD=password
MONGO_URL=mongodb://user:pass@domain.com:port/url
ENC_KEY=randomstring
REFRESH_SCHEDULE="1 * * * *"
ENABLE_SCHEDULER=true
```

Explanation
- `JENIUS_ENCRYPTED`: If true, then the `JENIUS_PASSWORD` should be encrypted first using `bin/generate-password-enc.js`.
- `JENIUS_EMAIL`: Your Jenius web email address credential.
- `JENIUS_PASSWORD`: Your Jenius web password credential.
- `MONGO_URL`: Mongo url.
- `ENC_KEY`: Key to encrypt your `XXX_PASSWORD` if `xxx_ENCRYPTED` is set true.
- `REFRESH_SCHEDULE`: Cron expression format to define the schedule to check your payment. Useful to automate payment ticket verification.
- `ENABLE_SCHEDULER`: If true, then automatic verification will be executed.


or you can use this via Docker
```
docker pull adamyordan/payment-auto-verifier
docker run -e MONGO_URL=<mongo_url> -e ... -d -p 3000:3000 adamyordan/payment-auto-verifier
```


Data Structure
===
Bank History schema:
```
{
    id: string, // transaction id
    amount: int, // transaction amount
    note: string, // transcaction note
    debitCredit: string, // 'DEBIT' or 'CREDIT'
    createdAt: string, // 'ISO date string'
    partnerName: string, // recipient or sender name
    partnerAccount: string, // recipient or sender account
    partnerOrg: string, // recipient or sender organization
    recognized: boolean, // true if transaction is already recognized, won't be checked anymore
    bank: string, // history's source bank name, e.g. 'jenius'
}
```

Payment Ticket schema:
```
{
    amount: int, // ticket payment amount
    uniqueCode: int, // unique code amount
    paid: boolean, // true if there is a bank history corresponding
    active: boolean, // true if not paid or not expired
    expiredTime: int, // unixtime
    paymentTime: int, // unixtime
}
```


API
===
Hit the following API endpoints to do something:

| Method | Endpoint                | Description
| ------ | ----------------------- |------------
| POST   | `/api/ticket/new`       | Create new ticket. *required* JSON body: `{ "amount": <int:amount> }`
| GET    | `/api/ticket/:ticketId` | Get status of ticket with id `<ticketId>`
| GET    | `/api/ticket/all`       | Get status of all tickets
| GET    | `/api/ticket/active`    | Get status of all active tickets
| GET    | `/api/action/refresh`   | Trigger automatic verification manually
| GET    | `/api/action/mark/paid/:ticketId` | Mark ticket with id `ticketId` as paid manually


License
===
The MIT license
