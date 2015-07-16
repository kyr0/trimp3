var child_process = require('child_process');
var argv = process.argv.slice(2);
var pkg = require('./package.json');
var fs = require('fs');

var libtrimp3 = {

    /**
     * Return the options provided via CLI
     * @return {Object}
     */
    getOpts: function() {

        return {
            mp3In: argv[0],
            mp3Out: argv[1],
            beginTime: argv[2],
            endTime: argv[3]
        };
    },

    /**
     * Checks time formats for validity.
     * @param {String} time Time provided
     * @return {Boolean}
     */
    isValidTimeFormat: function(time) {

        // hh:mm:ss
        if (/^[0]?(10|11|12|[1-9]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
            return true;
        }

        // mm:ss
        if (/^[0-5][0-9]:[0-5][0-9]$/.test(time)) {
            return true;
        }

        // ss
        if (/^[0-5][0-9]$/.test(time)) {
            return true;
        }
        return false;
    },

    /**
     * Returns true if in/out mp3 files are existing
     * and times match one of the supported formats.
     * @return {String|Boolean}
     */
    validateOpts: function() {

        var me = this,
            opts = me.getOpts();

        // required parameters missing?
        // (end time is okay to be omitted. in this case, only beginning of file will be trimmed.)
        if (!opts.mp3In || !opts.mp3Out || !opts.beginTime) {
            return 'At least one required parameter is missing: mp3In? mp3Out? beginTime? [endTime?]';
        }

        // beginTime format crap
        if (!me.isValidTimeFormat(opts.beginTime)) {
            return 'Format of begin time is invalid: ' + opts.beginTime;
        }

        // endTime set but format is crap
        if (opts.endTime && !me.isValidTimeFormat(opts.endTime)) {
            return 'Format of end time is invalid: ' + opts.endTime;
        }

        // input mp3 not there?
        if (!fs.existsSync(opts.mp3In)) {
            return 'Input mp3 file does not exist: ' + opts.mp3In;
        }
        return true;
    },

    /**
     * Prints the logo
     */
    printLogo: function() {

        console.log('');

        console.log(pkg.name, 'v' + pkg.version, 'by',
                    pkg.author.name + ',', pkg.releaseYear);
    },

    /**
     * Prints a pretty help msg / usage / examples.
     * Exits with error level 1.
     */
    printHelp: function (errorMsg) {

        var me = this;

        if (errorMsg) {

            console.log('');
            console.log('[!!] WARNING: ' + errorMsg);
            console.log('');
        }

        // TODO: Write nice help msg

        process.exit(1);
    },

    /**
     * Re-calculates the begin and end times
     * in seconds (ffmpeg requires that).
     * Returns them, wrapped in an object.
     * @return {Object}
     */
    calcTimes: function() {

        var me = this,
            opts = me.getOpts(),
            beginTime,
            endTime,
            parseTime = function(time) {

                var hours = 0,
                    minutes = 0,
                    seconds = 0;

                // parse format
                time = time.split(':');

                if (time.length === 3) {
                    hours = Number(time[0]);
                    minutes = Number(time[1]);
                    seconds = Number(time[2]);
                }

                if (time.length === 2) {
                    minutes = Number(time[0]);
                    seconds = Number(time[1]);
                }

                if (time.length === 1) {
                    seconds = Number(time[0]);
                }

                return {
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                }
            },
            calcTime = function(time) {

                var hoursInSec = time.hours * 60 * 60,
                    minutesInSec = time.minutes * 60;

                return hoursInSec + minutesInSec + time.seconds;
            };

        // calculate seconds out of hh:mm:ss
        beginTime = calcTime(parseTime(opts.beginTime));
        endTime = calcTime(parseTime(opts.endTime));

        if (endTime < beginTime) {
            throw new Error('End time is before begin time!');
        }

        return {
            beginTime: beginTime,
            endTime: endTime
        };
    },

    /**
     * Generates the command line and executes it.
     */
    trim: function() {

        var me = this,
            times,
            opts = me.getOpts(),
            cmds = [],
            outFile = opts.mp3Out,
            inFile = opts.mp3In;

        try {

            times = me.calcTimes();

        } catch(e) {

            console.log('[!!] ERROR: ', e.message);
            process.exit(1);
        }

        // 1. trim end (optional)

        // generate end trim option
        if (!isNaN(times.endTime)) {

            // let begin crop cmd use temp. output
            cmds.push(
                'env ffmpeg -t ' + times.endTime + ' ' +
                '-i "' + inFile + '" -acodec copy "' + 'tmp_' + outFile + '"'
            );

            inFile = 'tmp_' + outFile;
        }

        // 2. trim begin

        // default begin trim command

        if (times.beginTime > 0) {
            cmds.push(
                'env ffmpeg -ss ' + times.beginTime + ' ' +
                '-i "' + inFile + '" -acodec copy "' + outFile + '"'
            );
        }

        if (cmds[1]) {
            console.log('Trimming end first using cmd: ', cmds[0]);
        }

        child_process.exec(cmds[0], function(error, stdout, stderr) {

            console.log(stdout);

            console.log('[!!] ERROR: ', stderr);

            if (error == null) {

                if (cmds[1]) {

                    console.log('Now trimming beginning using cmd: ', cmds[1]);

                    child_process.exec(cmds[1], function (error, stdout, stderr) {

                        console.log(stdout);

                        console.log('[!!] ERROR: ', stderr);

                        if (error == null) {

                            console.log('Removing temporary file: ', 'tmp_' + outFile);

                            fs.unlinkSync('tmp_' + outFile);

                            console.log('Trimmed mp3 (begin+end) written to: ', outFile);

                        } else {

                            process.exit(1);
                        }
                    });

                } else {

                    console.log('Trimmed mp3 (begin) written to: ', outFile);
                }

            } else {
                process.exit(1);
            }
        });
    },

    /**
     * Executed on CLI call
     */
    cli: function() {

        var me = this,
            isInputValid = false;

        me.printLogo();

        isInputValid = me.validateOpts();

        if (isInputValid !== true) {

            me.printHelp(isInputValid);

        } else {

            me.trim();
        }
    }
};

// export
module.exports = libtrimp3;

