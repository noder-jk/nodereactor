module.exports.test_socket=($, next)=>
{
    nr_socket.emit('my_own_handler', {'hey':'some data'});
    next($);
}