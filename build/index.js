"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient({
    log: ['query']
});
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/user/:id/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield prisma.user.findUnique({
        where: {
            id,
        }
    });
    res.json(user);
}));
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const findEmail = yield prisma.user.findMany({
            where: {
                email: body.email
            }
        });
        if (findEmail.length) {
            res.status(500).send(false);
        }
        else {
            const user = yield prisma.user.create({
                data: {
                    email: body.email,
                    nome: body.email,
                    senha: body.email,
                }
            });
            res.status(201).send(true);
        }
    }
    catch (_a) {
        res.status(500).send(false);
    }
}));
app.post("/user/:id/favs/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const body = req.body;
    try {
        const livro = yield prisma.favoritos.create({
            data: {
                livroId: body.livroId,
                userId,
            }
        });
        res.status(201).send(true);
    }
    catch (_b) {
        res.status(500).send(false);
    }
}));
app.delete("/user/:id/favs/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const body = req.body;
    try {
        const livro = yield prisma.favoritos.deleteMany({
            where: {
                livroId: body.livroId,
                userId
            }
        });
        res.status(200).send(true);
    }
    catch (_c) {
        res.status(500).send(false);
    }
}));
app.get("/user/:id/favs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const favoritos = yield prisma.favoritos.findMany({
        where: {
            userId: id,
        },
        select: {
            livroId: true,
        }
    });
    let livros = [];
    for (let x = 0; x < favoritos.length; x++) {
        const livro = yield prisma.livro.findUnique({
            where: {
                id: favoritos[x].livroId
            }
        });
        livros.push(livro);
    }
    res.json(livros);
}));
app.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const livros = yield prisma.livro.findMany();
    res.json(livros);
}));
app.get("/book/info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const livro = yield prisma.livro.findUnique({
        where: {
            id
        }
    });
    res.json(livro);
}));
app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}/`);
});
