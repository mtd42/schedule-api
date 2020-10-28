import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const internal = ({ req, res }) => {
    const internalError = Object.assign({
        resource: {
            message: req.resource,
            code: 500,
        },
        links: {
            self: `${process.env.API_URL}${req.url}`,
        },
        metadata: {
            date: moment().format('LLL'),
            requestId: uuidv4(),
        },
    });
    return res.status(500).json(internalError);
};

const ok = ({req, res}) => {
    const okResponse = Object.assign({}, {
        resource: req.resource,
        links: {
            prev: process.env.API_URL,
            self: `${process.env.API_URL}${req.url}`,
        },
        metadata: {
            date: moment().format('LLL'),
            requestId: uuidv4(),
        },
    });
    return res.status(200).json(okResponse);
};

const conflict = ({req, res}) => {
    return res.status(409).json(req.resource);
};

const created = ({req, res}) => {
    return res.status(201).json(req.resource);
};

const badParams = ({ req, res }) => {
    const paramsError = Object.assign({
        resource: {
            message: req.resource,
            code: 400,
        },
        links: {
            self: `${process.env.API_URL}${req.url}`,
        },
        metadata: {
            date: moment().format('LLL'),
            requestId: uuidv4(),
        },
    });
    return res.status(400).json(paramsError);
};

const controller = (req, res, next) => {
    const data = { ...req, ...res };
    const request = {
        continue: () => next(),
        ok: () => ok(data),
        internal: () => internal(data),
        conflict: () => conflict(data),
        created: () => created(data),
        badParams: () => badParams(data),
    };
    request[req.state]();
};

export {
    controller,
};
