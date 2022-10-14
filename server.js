require('dotenv').config();
const FastBootAppServer = require('fastboot-app-server');
let notifier = null;
let downloader = null;
let distPath = process.env.DIST_PATH || '/app';

if (process.env.S3_BUCKET && process.env.S3_KEY) {
	config = {
		endpoint: process.env.S3_ENDPOINT,
		bucket: process.env.S3_BUCKET,
		key: process.env.S3_KEY,
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET,
	};
	const S3Notifier = require('./notifiers/s3');
	const S3Downloader = require('./downloaders/s3');
	notifier = new S3Notifier(config);
	downloader = new S3Downloader(config);
	distPath = null;
} else {
	const FSNotifier = require('fastboot-fs-notifier');
	notifier = new FSNotifier({
		targetDir: distPath,
	});
}

let server = new FastBootAppServer({
	notifier,
	downloader,
	distPath,
	gzip: !!process.env.GZIP,
	host: process.env.HOST || '0.0.0.0',
	sandboxGlobals: process.env,
	chunkedResponse: !!process.env.CHUNKED,
});

server.start();
