const info = (message) => {
    if (process.env.NODE_ENV === 'localhost') {
        console.log(message);
    } else {
        // use logger like logstash, etc
    }
};

module.exports = {
    info
};
