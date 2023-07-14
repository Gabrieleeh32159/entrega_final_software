import Express from "express"
import Morgan from "morgan"
import { accounts } from "./accounts.js";
import { operations } from "./operations.js";

//* Configuration *\\

const app = Express();
app.use(Morgan("dev"));

//* Configuration *\\

//* Routes *\\

app.get("/", (req, res) => {
    res.send("Hola mundo")
})

app.get("/billetera/contactos", (req, res) => {
    const mynumber = req.query.minumero
    const account = accounts.find(account => account.numero == mynumber);

    const contactos = account.contactos.map(num =>
        `${num}: ${accounts.find(account => account.numero == num).owner}`
    )

    if (contactos == null) {
        res.json({
            status: 404,
            msg: "usuario no encontrado"
        })
    } else {
        res.json({
            status: 200,
            contactos: contactos
        })
    }
})

app.get("/billetera/pagar", (req, res) => {
    const mynumber = req.query.minumero
    const numberdestiny = req.query.numerodestino
    const value = req.query.valor

    const origin = accounts.find(account => account.numero == mynumber);
    const destiny = accounts.find(account => account.numero == numberdestiny);

    let response = {}

    if (origin == null) {
        response = {
            status:404,
            msg: "usuario de origen no encontrado"
        }
    } else if (destiny == null){
        response = {
            status:404,
            msg: "usuario de destino no encontrado"
        }
    } else {
        origin.saldo -= value;
        destiny.saldo += parseInt(value);

        const operation = {
            numeroOrigen: mynumber,
            numeroDestino: numberdestiny,
            fecha: "11/07/2023",
            valor: value
        }

        operations.push(operation)

        response = {
            status: 200,
            operation: operation
        }
    }

    res.json(response)
})

app.get("/billetera/historial", (req, res) => {
    const mynumber = req.query.minumero;

    const myaccount = accounts.find(account => account.numero == mynumber);

    const historial = operations.map(operation => {
        if (operation.numeroOrigen == mynumber) {
            return `Pago realizado de ${operation.valor} a ${accounts.find(account => account.numero == operation.numeroDestino).owner}`
        } else if (operation.numeroDestino == mynumber) {
            return `Pago realizado de ${operation.valor} de ${accounts.find(account => account.numero == operation.numeroOrigen).owner}`
        } else {
            return;
        }
    })

    res.send(
        `Saldo de ${myaccount.owner}<br/>Operaciones de ${myaccount.owner}<br/>${historial.join("<br/>")}`
    )
})

//* Routes *\\

const PORT = 8000;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);
