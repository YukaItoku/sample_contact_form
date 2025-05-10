import type { AstroIntegration } from 'astro'
import { promises as fs, type PathLike } from 'fs'
import { readFile } from 'fs/promises'
import { parse, HTMLElement as NHPHTMLElement } from 'node-html-parser'

function handleSrc(buffer: Buffer, pathname: PathLike | fs.FileHandle) {
  const html = parse(buffer.toString(), { comment: true })

  html.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (src && src.startsWith('/images/')) {
        const fileName = src.split('/').pop()
        img.setAttribute('src', `./images/${fileName}`)
      }
    })

    html.querySelectorAll('video').forEach((img) => {
      const src = img.getAttribute('src')
      if (src && src.startsWith('/images/')) {
        const fileName = src.split('/').pop()
        img.setAttribute('src', `./images/${fileName}`)
      }
    })

    html.querySelectorAll('link').forEach((link) => {
      console.log(link, "link")
      const href = link.getAttribute('href')
      if (href && href.startsWith('/css/')) {
        const fileName = href.split('/').pop()
        link.setAttribute('href', `./css/${fileName}`)
      }
    })

    html.querySelectorAll('script').forEach((script) => {
      const src = script.getAttribute('src')
      if (src && src.startsWith('/js/')) {
        const fileName = src.split('/').pop()
        script.setAttribute('src', `./js/${fileName}`)
      }
    })

    const rectEle = html.querySelector('astro-island')
    if(rectEle) {
      const componentUrl = rectEle.getAttribute('component-url')
      const rendererUrl = rectEle.getAttribute('renderer-url')
      const componentUrlFileName = componentUrl?.split('/').pop()
      const rendererUrlFileName = rendererUrl?.split('/').pop()
      rectEle.setAttribute('component-url', `./js/${componentUrlFileName}`)
      rectEle.setAttribute('renderer-url', `./js/${rendererUrlFileName}`)
    }

    return fs.writeFile(pathname, html.toString(), 'utf-8')
  
}

export const editPath = (): AstroIntegration => {
  return {
    name: 'astro-integration-inside-to',
    hooks: {
      'astro:build:done': async ({ routes }) => {
        const processes = routes.map(async (route) => {
          const distURLs = route.distURL
          
          if (!distURLs) return


          const pathnamePromises = distURLs.map((url) => {
            if (url instanceof URL) {
              return url.pathname
            } else {
              return new URL(url).pathname
            }
          })

          const pathnames = await Promise.all(pathnamePromises)

          // 各pathnameに対して処理を実行
          const fileProcesses = pathnames.map(async (pathname) => {
            try {
              const buffer = await readFile(pathname)
              await handleSrc(buffer, pathname)
            } catch (reason) {
              console.error('Error processing file:', reason)
            }
          })

          await Promise.all(fileProcesses)
        })

        await Promise.all(processes)
      },
    },
  }
}