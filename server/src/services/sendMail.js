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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("@prisma/client");
require("dotenv").config();
const prisma = new client_1.PrismaClient();
function sendEmail(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env["EMAIL_USER"],
                pass: process.env["EMAIL_PASS"],
            },
        });
        if (!user) {
            console.error("Usuário não encontrado.");
            return;
        }
        const mailOptions = {
            from: '"DGMOG - WebApps" <dgmog.ses@gmail.com>',
            to: email,
            subject: `Form - Monitoramento de GERES`,
            html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">Olá ${user.fullName},</h2>
        <p style="color: #555;">
          Aqui está a sua nova senha para acessar o sistema de monitoramento de GERES:
        </p>
        <h3 style="background-color: #007bff; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
          ${password}
        </h3>
        <p style="color: #555;">
          Você está associado à GERES: <strong>${user.geres}</strong>.
        </p>
        <p style="color: #555;">
          Por favor, mantenha sua senha em um lugar seguro e não a compartilhe com ninguém.
        </p>
        <p style="color: #555;">Se você não solicitou essa alteração, por favor, entre em contato conosco.</p>
        <footer style="margin-block-start: 20px; font-size: 12px; color: #999;">
          <p>Atenciosamente,</p>
          <p>DGMOG - WebApps</p>
        </footer>
      </div>
    `,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("E-mail enviado: %s", info.messageId);
        }
        catch (error) {
            console.error("Erro ao enviar o e-mail: ", error);
        }
    });
}
