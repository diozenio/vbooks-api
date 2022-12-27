import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
    log: ['query']
});
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/user/:id/info", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            }
        })
        res.json(user);
    } catch (error) {
        return res.send({ "error": error });
    }

});

app.post("/login", async (req, res) => {
    try {
        console.log(req.body);
        
        const email = req.body.email;
        const senha = req.body.senha;

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email,
            }
        })

        if (user.senha == senha) {
            res.json(user);
        } else {
            return res.send({ "error": "Credenciais incorretas" });
        }
    } catch (error) {
        return res.send({ "error": error });
    }

});

app.post("/user/create", async (req, res) => {
    const body: any = req.body;
    console.log(body);
    try {
        const findEmail = await !prisma.user.findFirstOrThrow({
            where: {
                email: body.email
            }
        })

        const user = await prisma.user.create({
            data: {
                email: body.email,
                nome: body.email,
                senha: body.email,
            }
        })

        res.status(201).send(true);

    } catch {
        res.status(500).send(false);
    }
})

app.post("/user/:id/favs/new", async (req, res) => {
    const userId = req.params.id;
    const body = req.body;
    try {
        const livro = await prisma.favoritos.create({
            data: {
                livroId: body.livroId,
                userId,
            }
        })
        res.status(201).send(true);
    } catch {
        res.status(500).send(false);
    }
});

app.delete("/user/:id/favs/delete", async (req, res) => {
    const userId = req.params.id;
    const body = req.body;
    try {
        const livro = await prisma.favoritos.deleteMany({
            where: {
                livroId: body.livroId,
                userId
            }
        })
        res.status(200).send(true);
    } catch {
        res.status(500).send(false);
    }
});


app.get("/user/:id/favs", async (req, res) => {
    try {
        const id = req.params.id;
        const favoritos = await prisma.favoritos.findMany({
            where: {
                userId: id,
            },
            select: {
                livroId: true,
            }
        })

        let livros: Array<any> = [];

        for (let x: number = 0; x < favoritos.length; x++) {
            const livro = await prisma.livro.findUnique({
                where: {
                    id: favoritos[x].livroId
                }
            })
            livros.push(livro);
        }

        res.json(livros);
    } catch (error) {
        return res.send({ "error": error });
    }
});

app.get("/books", async (req, res) => {
    try {
        const livros = await prisma.livro.findMany()
        res.json(livros);
    } catch (error) {
        return res.send({ "error": error });
    }
});

app.get("/book/info/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const livro = await prisma.livro.findUniqueOrThrow({
            where: {
                id
            }
        })
        res.json(livro);
    } catch (error) {
        return res.send({ "error": error });
    }
});

app.get("/book/search/:value", async (req, res) => {
    try {
        const value = req.params.value;
        const livro = await prisma.livro.findMany({
            where: {
                titulo: {
                    contains: value
                }
            }
        })
        res.json(livro);
    } catch (error) {
        return res.send({ "error": error });
    }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/`);
})