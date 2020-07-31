// Get dependencies
const cluster = require('cluster');
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const compress = require('compression');
const numCPUs = require('os').cpus().length;


const runApp = async() => {
	const app = express();
	 app.use(compress({
	    filter: function (req, res) {
	      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
	    },
	    level: 9
	}));
	// Parsers for POST data
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	// Point static path to dist
	app.use(express.static(path.join(__dirname, 'server')));
	//app.set('views', __dirname + '/src');
	//app.set("view engine", "html");

	// Set our api routes

	// Catch all other routes and return the index file


	app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'server/index.html'));
	});

	/**
	 * Get port from environment and store in Express.
	 */
	const port = process.env.PORT || '80';
	app.set('port', port);

	/**
	 * Create HTTP server.
	 */
	const server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */
	server.listen(port, () => console.log(`API running on localhost:${port}`));
};

// Get our API routes
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  runApp();
  console.log(`Worker ${process.pid} started`);
}
