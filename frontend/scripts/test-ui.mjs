import { spawn } from 'node:child_process'

const vitest = spawn('vitest', ['--ui', '--watch', '--open=false'], {
  shell: process.platform === 'win32',
  stdio: ['inherit', 'pipe', 'pipe'],
})

let output = ''
let browserOpened = false

function openBrowser(url) {
  if (browserOpened) return
  browserOpened = true

  const [command, args] = process.platform === 'win32'
    ? ['rundll32.exe', ['url.dll,FileProtocolHandler', url]]
    : process.platform === 'darwin'
      ? ['open', [url]]
      : ['xdg-open', [url]]
  const browser = spawn(command, args, { detached: true, stdio: 'ignore' })

  browser.on('error', (error) => {
    console.error(`Could not open the Vitest UI in a browser: ${error.message}`)
  })
  browser.unref()
}

function forwardAndOpen(stream, destination) {
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    destination.write(chunk)
    output = (output + chunk).slice(-4096)

    const match = output.match(/https?:\/\/[^\s\x1b]+\/__vitest__\/\?token=[^\s\x1b]+/)
    if (match) openBrowser(match[0])
  })
}

forwardAndOpen(vitest.stdout, process.stdout)
forwardAndOpen(vitest.stderr, process.stderr)

vitest.on('error', (error) => {
  console.error(`Could not start Vitest: ${error.message}`)
  process.exitCode = 1
})

vitest.on('close', (code) => {
  if (!browserOpened && code === 0) {
    console.error('Vitest exited without printing an authenticated UI URL.')
    process.exitCode = 1
    return
  }

  process.exitCode = code ?? 1
})
