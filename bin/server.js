import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}

const run = (app) => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://${process.env.HOST}:${process.env.PORT}`);
    });
};

export {
    run,
};
