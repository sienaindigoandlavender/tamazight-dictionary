# Amawal - Tamazight Dictionary

<div align="center">
  <h2>ⴰⵎⴰⵡⴰⵍ</h2>
  <p>An online dictionary for the Tamazight language featuring Tifinagh script</p>
</div>

## About

**Amawal** (ⴰⵎⴰⵡⴰⵍ - "dictionary" in Tamazight) is an online dictionary dedicated to preserving and promoting the Tamazight language. Currently featuring **Tachelhit** (Southern Morocco), with plans to expand to other regional varieties.

Part of the **Amazigh Series**.

## Features

- **Dictionary Search** - Look up words in Tachelhit with instant search
- **Tifinagh Display** - All entries shown in traditional Tifinagh script
- **Bilingual Definitions** - English and French translations
- **Verb Conjugation** - Complete conjugation tables (aorist, preterite, imperative, intensive)
- **Tifinagh Alphabet** - Full alphabet reference with pronunciation guides
- **Audio Pronunciation** - Audio playback support (audio files to be added)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Data**: JSON files
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dictionary.

## Project Structure

```
tamazight-dictionary/
├── app/                    # Next.js app router pages
├── components/             # React components
├── data/                   # Dictionary and conjugation data (JSON)
├── lib/                    # Utility functions
├── types/                  # TypeScript interfaces
└── public/                 # Static assets (audio, fonts)
```

## Adding Words

Dictionary entries are stored in `data/dictionary/tachelhit.json`. Each entry follows this structure:

```json
{
  "id": "word-001",
  "word": "akal",
  "tifinagh": "ⴰⴽⴰⵍ",
  "pronunciation": "/akal/",
  "partOfSpeech": "noun",
  "gender": "masculine",
  "definitions": [
    { "meaning": "earth, land", "language": "en" },
    { "meaning": "terre, sol", "language": "fr" }
  ],
  "region": "tachelhit"
}
```

## Regional Varieties

- **Tachelhit** (Active) - Southern Morocco
- **Kabyle** (Coming Soon) - Algeria
- **Tarifit** (Coming Soon) - Northern Morocco
- **Central Atlas** (Coming Soon) - Central Morocco

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tamazight-dictionary)

Or manually:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy

## Contributing

Contributions are welcome, especially:
- Additional Tachelhit vocabulary
- Pronunciation audio recordings
- Other Tamazight regional data
- Bug fixes and improvements

## License

MIT

---

<div align="center">
  <p>ⵜⴰⵎⴰⵣⵉⵖⵜ</p>
  <p><em>Preserving the Amazigh language for future generations</em></p>
</div>
