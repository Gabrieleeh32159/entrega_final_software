import test from "node:test"

test('Test caso de exito al transferir', async (t) => {

  const response = await fetch("http://localhost:8000/billetera/contactos?minumero=21345")
  const data = await response.json()
  
  const isdata = {status:200,contactos:["123: Luisa","456: Andrea"]}
  assert.strictEqual(data, isdata);
});

test('Test caso de usuario no existente', async (t) => {

  const response = await fetch("http://localhost:8000/billetera/contactos?minumero=6542365")
  const data = await response.json()
  
  const isdata = {status:404, msg: "usuario no encontrado"}
  assert.strictEqual(data, isdata);
});

test('Test caso de usuario de origen inexistente', async (t) => {

  const response = await fetch("http://localhost:8000/billetera/pagar?minumero=61532&numerodestino=123&valor=100")
  const data = await response.json()

  const isdata = {status:404, msg: "usuario de origen no encontrado"}
  assert.strictEqual(data, isdata);
});

test('Test caso de usuario de destino inexistente', async (t) => {

  const response = await fetch("http://localhost:8000/billetera/pagar?minumero=21345&numerodestino=8172&valor=100")
  const data = await response.json()

  const isdata = {status:404, msg: "usuario de destino no encontrado"}
  assert.strictEqual(data, isdata);
});