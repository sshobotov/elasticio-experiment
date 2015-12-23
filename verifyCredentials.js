module.exports = verify;

function verify(credentials, cb) {

    console.log('About to verify credentials');

    if (!credentials.authToken) {
        console.error('Generated Auth Token can not be empty');

        return cb(null, {verified: false});
    }

    console.log('Successfully verified credentials');

    cb(null, {verified: true});
}

