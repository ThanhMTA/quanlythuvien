import { Strategy, ExtractJwt } from 'passport-jwt';
//import 'dotenv/config'; // Đảm bảo bạn đã cài đặt dotenv trước khi sử dụng
import mongoose from 'mongoose';
import User from './models/User.js'; // Đảm bảo đường dẫn đến tệp là đúng
const secret = process.env.SECRET || 'some other secret as default';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

export default passport => {
    passport.use(
        new Strategy(opts, (payload, done) => {

            User.findById(payload.id)
                .then(user => {
                    if (user) {
                        return done(null, {
                            id: user.id,
                            username: username,
                        });
                    }
                    return done(null, false);
                }).catch(err => console.error(err));

        })
    );
};
