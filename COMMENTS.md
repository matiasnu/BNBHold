## Comentarios relacionados con desiciones del codigo

- Para poder trabajar con metamask y al mismo tiempo poder recibir eventos de una misma Red, aqui se propone instanciar 2 web providers diferentes

https://ethereum.stackexchange.com/questions/57752/how-to-access-metamask-accounts-when-using-infura-websockets

## Numeros decimales

Para mostrar los valores decimales propongo que mostremos solo 4 digitos
Por ejemplo, de este nuevo
1.811979462711226852
mostrar
1.8119
Ejemplo
contractBalance = contractBalance.toPrecision(5);
