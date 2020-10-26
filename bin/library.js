const handleError = (req, err) => {
    console.error(err);
    if (err.type) {
        req.state = err.type;
        req.resource = err.message;
    } else {
        req.state = 'internal';
    }
};

const messageError = (type, message) => {
    return Object.assign({}, {
        type,
        message,
    });
};

export {
    handleError,
    messageError,
};
