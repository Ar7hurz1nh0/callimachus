import express from 'express';
import { log, warn, error } from './lib/log4';
import mongoose from 'mongoose';
import { readdirSync, statSync, watch } from 'fs';
import { join, parse, normalize } from 'path';

import type { Request, Response } from 'express';
interface Route {
  path: string,
  name: string,
  run: (req: Request, res: Response) => void
}

const app = express();
const routes = getRoutes('./routes').map(parseFile);
const Routes = watch('./routes', { recursive: true, persistent: true })

Routes.on('change', (file: string) => {
  warn(`$c magenta Detected change in $$$c cyan ${parse(file).base}$$ $c yellowBright command$$`)
  const newCommand = reloadRoute(file)
  if (newCommand === undefined) return
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].name === newCommand.name) {
      routes[i] = newCommand
      log(`$c green Reloaded $$$c cyan ${newCommand.name}$$ $c yellowBright command$$`)
      return
    }
  }
})

function reloadRoute(route: string): Route | undefined {
  const file = join(__dirname, route);
  console.log(file)
  warn(`$c red Deleting $$$c cyan ${parse(route).base}$$ $c red cache$$`);
  delete require.cache[require.resolve(file)]
  return parseFile(file)
}

function getRoutes(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath)
  files.forEach(function(file) {
    if (statSync(join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getRoutes(join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push(join(__dirname, dirPath, file))
    }
  })
  return arrayOfFiles
}

function parseFile(filePath: string): Route {
  const parsed = parse(filePath)
  const file: Route = { 
    path: normalize(parsed.dir.replace(join(process.cwd(), 'routes'), '/')),
    name: parsed.name,
    run: require(filePath).default
  }
  file.path = file.path.replace(/\[(\w*)\]/, (_, name) => `:${name}`)
  file.name = file.name.replace(/\[(\w*)\]/, (_, name) => `:${name}`)
  return file
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: () => void) => {
  let color
  switch (req.method) {
    case 'GET':
      color = 'greenBright'
      break
    case 'POST':
      color = 'yellow'
      break
    case 'PUT':
      color = 'blueBright'
      break
    case 'DELETE':
      color = 'red'
      break
    default:
      color = 'white'
  }
  log(`#c ${color}  $c black ${req.method}$$ ## ${req.path}`);
  next();
})

routes.forEach(route => {
  const path = route.name === 'index' ? route.path : join(route.path, route.name);
  if (route.run) try { app.all(path, route.run) } catch (e: any) { error(e.message) }
  return log(`#c whiteBright  $c black ${path}$$ ## Added`);
})

const server = app.listen(3333, () => log('$c green Listening on port 3333$$'))

process.on('exit', server.close)