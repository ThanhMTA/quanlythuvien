import express from "express";
import User from "../models/User.js";
import Role from "../models/role.js";
import BookTransaction from "../models/BookTransaction.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from '../config/auth.js'

export const signin = (req, res) => {
    console.log('singin')
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({ id: user.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });
            console.log('thanh cong')
            console.log("run in signin test !!" + token);

            var authorities = [];
            res.status(200).send({
                _id: user._id,
                userFullName: user.userFullName,
                email: user.email,
                roles: authorities,
                isAdmin: user.isAdmin,
                accessToken: token
            })

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};