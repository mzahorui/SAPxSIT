// Export a function that receives the service instance as an argument
module.exports = (srv) => {
  // Register a handler for the 'ping' event/function of the service
  srv.on("ping", () => {
    // Return a simple 'ok' string as the response
    return "ok";
  });
};
