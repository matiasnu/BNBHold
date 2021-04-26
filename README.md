# BNBHold
Cuando tenemos un nuevo contrato ejecutamos
```bash
truffle migrate
```

Para correr la suite de test que se encuentra en la carpeta test ejecutamos.
```bash
truffle test
```

Para iniciar la pagina web corremos.
```bash
npm run start
```

### Call contract methods with truffle and ganache
Dentro de truffle develop
Para llamar a las funciones del contrato tomaremos la address del contrato que se deployo. Y ejecutamos:
```bash
ThunderHold.at("0xF0f8e7A1FE09105AAb97A0084035D98dDD77bEb6")
```
Esto me devuelve la instancia del contrato creado.

Debemos realizar lo siguiente:
```bash
var contract
ThunderHold.deployed().then( function(instance) { contract=instance; });
contract.getContractBalance().then(function(r) {response = r.toString(10); }); // Call function
response //View response
```