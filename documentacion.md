# 📈 Bolsa de Valores Blockchain (DApp)

Este proyecto simula una Bolsa de Valores descentralizada donde puedes comprar y vender acciones (**StockToken**) usando una moneda ficticia (**USDX / Dólar Digital**).

## 🚀 Requisitos Previos

1.  **Node.js**: Instalado en tu sistema.
2.  **Ganache**: Para ejecutar la blockchain local. Descárgalo de [trufflesuite.com/ganache](https://trufflesuite.com/ganache/).
3.  **MetaMask**: Extensión de navegador para conectar tu billetera.

---

## 🛠️ Instalación y Configuración

### 1. Configurar Ganache
1.  Abre **Ganache**.
2.  Haz clic en **"Quickstart"** (Inicio Rápido).
3.  Asegúrate de que el servidor esté corriendo en el puerto **7545**. (RPC Server: `HTTP://127.0.0.1:7545`).

### 2. Configurar MetaMask
1.  Abre MetaMask y agrega una red manualmente (si no la tienes):
    *   **Nombre**: Ganache Local
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **ID de Cadena**: `1337` (o el que diga Ganache).
    *   **Símbolo**: ETH
2.  **Importar Cuenta**:
    *   En Ganache, copia la **Private Key** (Icono de llave) de la primera cuenta (Index 0).
    *   En MetaMask -> Clic en el círculo de perfil -> **Importar cuenta** -> Pega la clave privada.

### 3. Preparar el Proyecto
Abre una terminal en la carpeta principal del proyecto:

```bash
cd fron
npm install
```

---

## ⚡ Despliegue de Contratos (Deploy)

Cada vez que reinicies Ganache, debes "subir" los contratos de nuevo a la blockchain vacía.

1.  Asegúrate de estar en la carpeta `fron`.
2.  Ejecuta el script de despliegue:

```bash
node deploy.js
```

**Este script hará mágicamente:**
*   Creará el Token de Acciones (**TSTK**).
*   Creará el Dólar Digital (**USDX**).
*   Creará el Mercado.
*   Le dará fondos al Mercado (para vender) y **te dará $500,000 USDX a TI** para que operes.

---

## 🖥️ Ejecutar la Aplicación

Una vez desplegados los contratos:

```bash
npm run dev
```

Abre tu navegador en la dirección que aparece (usualmente **`http://localhost:5173`**).

---

## 📖 Manual de Uso

### Conectar
Haz clic en **"Conectar Billetera"**. Asegúrate de estar en la red de Ganache en MetaMask.

### 💰 Tu Portafolio
Verás 3 tarjetas:
*   **Balance (USDX)**: Tus dólares digitales disponibles para comprar.
*   **Acciones (TSTK)**: Cuántas acciones posees.
*   **Tasa**: El precio actual (1 USDX = 100 TSTK).

### 🛒 Comprar Acciones
1.  En la tarjeta **Comprar**, ingresa cuántos **USDX** quieres gastar (ej. `100`).
2.  Clic en **"Comprar TSTK"**.
3.  **MetaMask (Paso 1)**: Te pedirá **Aprobar** el límite de gasto de tus USDX. Confirma.
4.  **MetaMask (Paso 2)**: Te pedirá confirmar la compra. Confirma.

### 📉 Vender Acciones
1.  En la tarjeta **Vender**, ingresa cuántas **Acciones (TSTK)** quieres vender (ej. `50`).
2.  Clic en **"Vender TSTK"**.
3.  **MetaMask (Paso 1)**: Te pedirá **Aprobar** al mercado para tomar tus acciones.
4.  **MetaMask (Paso 2)**: Te pedirá confirmar la venta.

---

## ⚠️ Solución de Problemas Comunes

*   **Error "User denied transaction"**:
    *   Significa que rechazaste la confirmaicón en MetaMask. Inténtalo de nuevo.
*   **Botón "Confirmar" deshabilitado en MetaMask**:
    *   Si ves un botón rojo que dice **`@ Revisar alerta`**, haz clic en él y acepta la advertencia de seguridad. Es normal en redes de prueba.
*   **El saldo sale en 0 pero en Ganache tengo ETH**:
    *   Recuerda que ahora usamos **USDX**, no ETH. Ejecuta `node deploy.js` para recibir tus USDX ficticios.
