// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Personas {
    struct Persona {
        uint id;
        string nombre;
        string cedula;
        string email;
        string direccion;
        uint edad;
        bool activa;
        uint256 fechaCreacion;
    } }