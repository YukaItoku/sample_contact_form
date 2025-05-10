import { promises as fs } from 'fs'
import { join, basename } from 'path'
import type { AstroIntegration } from 'astro'

async function findScriptFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findScriptFiles(fullPath)))
    } else if (/\.js/i.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files;
}

export const createDeriveryFolder = (): AstroIntegration => {
  return {
    name: 'astro-integration-inside-to',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distScriptsDir = join(dir.pathname, `js`)

        const scriptFiles = await findScriptFiles(join(dir.pathname, '_astro'))
        if(scriptFiles.length > 0) {
          for (const file of scriptFiles) {
            const dest = join(distScriptsDir, basename(file))
            await fs.copyFile(file, dest)
          }
        }
      }
    }
  }
}