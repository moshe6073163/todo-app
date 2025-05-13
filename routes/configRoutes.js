const usersRoutes = require('./usersR');
const todosRoutes = require('./todosR');

module.exports = (app) => {
    app.get('/', (req, res)=>{
        res.status(200).json({ message: 'Welcome to the API' });
    });
    app.use('/users', usersRoutes);
    app.use('/todos', todosRoutes);

    app.use((req, res, next) => {
        res.status(404).json({ message: 'Route not found' });
    });
}