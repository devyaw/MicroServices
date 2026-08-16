import 'dotenv/config';
import express from 'express';
import proxy from 'express-http-proxy';

const app = express();
app.use(express.json());

const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, '/api');
    },
    proxyReqOptDecorator: (proxyReq, req) => {
        if (req.headers['authorization']) {
            proxyReq.headers['authorization'] = req.headers['authorization'];
        }
        return proxyReq;
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
        return JSON.stringify(srcReq.body);
    },

};

app.use(
    '/v1',
    proxy(process.env.identity, proxyOptions)
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
