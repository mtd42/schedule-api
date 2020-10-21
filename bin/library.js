const handle_errors = (req, err) => {
    console.error(err);
    if (err.type) {
        req.state = err.type;
        req.resource = err.message;
    } else {
        req.state = 'internal_server';
    }
};

const message_error = (type, message, error) => {
    return Object.assign({}, {
        type,
        message,
        error,
    });
};

export {
    handle_errors,
    message_error,
};
