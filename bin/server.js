import dotenv from 'dotenv';

dotenv.config();

const run = (app) => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://${process.env.HOST}:${process.env.PORT}`);
    });
};

export {
    run,
};
