import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, '../dist/index.html')

let html = readFileSync(htmlPath, 'utf-8')

// Extract the JS file name from the script tag
const jsMatch = html.match(/src="(\/assets\/[^"]+\.js)"/)
if (!jsMatch) {
  console.error('❌ Could not find JS file in index.html')
  process.exit(1)
}

const jsFile = jsMatch[1]
console.log('Found JS file:', jsFile)

// Rewrite the entire HTML with the script in body without type=module
const newHtml = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zentalk.AI - Intelligent Agents, Infinite Scale</title>
    <meta name="description" content="Plataforma de atendimento ao cliente com IA para WhatsApp. Agentes inteligentes 24/7." />
  </head>
  <body>
    <div id="root"></div>
    <script src="${jsFile}"></script>
  </body>
</html>
`

writeFileSync(htmlPath, newHtml)
console.log('✅ index.html fixed successfully')
console.log('Final content:')
console.log(newHtml)
