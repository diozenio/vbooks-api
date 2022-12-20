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
    const id = req.params.id;
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })
    res.json(user);
});

app.post("/user", async (req, res) => {
    const body: any = req.body;
    try {
        const findEmail = await prisma.user.findMany({
            where: {
                email: body.email
            }
        })

        if (findEmail.length) {
            res.status(500).send(false);
        } else {
            const user = await prisma.user.create({
                data: {
                    email: body.email,
                    nome: body.email,
                    senha: body.email,
                }
            })

            res.status(201).send(true);
        }
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
});

app.get("/books", async (req, res) => {
    const livros = await prisma.livro.findMany()
    res.json(livros);
});

app.get("/book/info/:id", async (req, res) => {
    const id = req.params.id;
    const livro = await prisma.livro.findUnique({
        where: {
            id
        }
    })
    res.json(livro);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/`);
})