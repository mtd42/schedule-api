const internal = ({ req, res }) => {
    return res.status(500).json(req.resource);
};

const ok = ({req, res}) => {
    return res.status(200).json(req.resource);
};

const conflict = ({req, res}) => {
    return res.status(409).json(req.resource);
};

const created = ({req, res}) => {
    return res.status(201).json(req.resource);
};

const controller = (req, res, next) => {
    const data = { ...req, ...res };
    const request = {
        continue: () => next(),
        ok: () => ok(data),
        internal: () => internal(data),
        conflict: () => conflict(data),
        created: () => created(data),
    };
    request[req.state]();
};

export {
    controller,
};
