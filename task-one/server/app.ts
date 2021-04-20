import http, { IncomingMessage, Server, ServerResponse } from "http";
import Organization, { Org } from './services'

interface Error {
    status: string,
    message: string
}

const server: Server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      if (req.url === '/') {
        try {
            const all: Array<Org> = await Organization.getAll()
            res.end(JSON.stringify(all));
        } catch (error) {
            res.writeHead(500)
           const err: Error = {status: "error", message: "an error occurred"} 
           res.end(JSON.stringify(err))
        }
      } else {
        try {
            const id: number = req.url ? +req.url.split('/')[1] : 0
            const one: Org = await Organization.getOne(id)
            res.end(JSON.stringify(one));
        } catch (error) {
            res.writeHead(404)
            const err: Error = {status: "error", message: `${error}`} 
            res.end(JSON.stringify(err))
        }
      }
    }
    if (req.method === 'POST') {
        req.on('data', async (chunk) => {
            try {
                const data: Org = JSON.parse(chunk)
                const response: Org = await Organization.createOne(data)
                res.end(JSON.stringify(response))
            } catch (error) {
                res.writeHead(500)
                const err: Error = {status: "error", message: "an error occurred"} 
                res.end(JSON.stringify(err))
            }
        })
    
    }

    if (req.method === 'PUT') {
        req.on('data', async (chunk) => {
            try {
                const id: number = req.url ? +req.url.split('/')[1] : 0
                const data: Org = JSON.parse(chunk)
                const response: Org = await Organization.updateOne(id, data)
                res.end(JSON.stringify(response))
            } catch (error) {
                res.writeHead(500)
                const err: Error = {status: "error", message: "an error occurred"} 
                res.end(JSON.stringify(err))
            }
        })
    }

    if (req.method === 'DELETE') {
      try {
        const id: number = req.url ? +req.url.split('/')[1] : 0
        const response: { status: string } = await Organization.removeOne(id)
        res.end(JSON.stringify(response))
      } catch (error) {
        res.writeHead(500)
        const err: Error = {status: "error", message: "an error occurred"} 
        res.end(JSON.stringify(err))
      }
    }
  }
);

server.listen(3005, () => console.log(`server is live at port 3005`));