module.exports.test_socket=($, next)=>
{
    console.log('Hi this is first ever socket test');

    console.log($._IO);

    nr_socket.emit('my_own_handler', {'hey':'some data'});

    next($);
}