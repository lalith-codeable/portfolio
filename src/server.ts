import express, {Request, Response} from "express";
import cors, {CorsOptions} from "cors";
import cluster from "cluster";
import os from "os"

const totalCpus = os.cpus().length;
const PORT = 3000;

if(cluster.isPrimary){
    console.log("Starting cluster forking.");
    for(let i=0; i<totalCpus; i++){
        cluster.fork();
    }
    cluster.on("exit",(worker)=>{
        console.log(`Worker with pid:${worker.process.pid} exited.`);
        console.log(`Starting another Process.`);
        cluster.fork()
    })
} else {
    const app = express();
    const corsOptions : CorsOptions = {
        origin: true,
        credentials: true
    }
    app.use(cors(corsOptions));
    app.all("/",(req: Request, res: Response)=>{
        res.status(200).json({server_response:"Domain lalith.xyz owned by: lalith borana.", your_public_ip: req.ip});
    })
    app.listen(PORT,()=>console.log(`Worker with pid:${process.pid} listening on port:${PORT}.`));
}