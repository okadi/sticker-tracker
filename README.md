# sticker-tracker
Track sticker usage in a Discord server.

## Setting up

### Configuration

Rename `config-example.json` to `config.json` and fill out with bot's token and user ID

### Running

Clone the repository:
```
git clone https://github.com/okadi/sticker-tracker.git
```

Enter directory:
```
cd sticker-tracker
```

Install dependencies:
```
npm install
```

Start the bot:
```
npm start
```

## Usage

While running, the bot will track stickers sent in channels it can see.

Use `/stickers` to see the totals. Currently only tracks stickers from the current server.