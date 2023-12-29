
const logger = require("../config/winston");
const axios = require("axios");
const JwtAuth = (function () {
    let token;
    let exp;
    const getToken = async () => {
        const isExpired = ((Date.now() / 1000)) > (exp - 60)
        if (!token || isExpired) {
            logger.info(`Token not found/expired. refresh: isExpired: ${isExpired} | ${token}`)
            exp = Math.floor(new Date().getTime() / 1000) + 3300;
            const config = {
                method: 'post',
                url: process.env.ZOOM_OAUTH_ENDPOINT,
                params: {
                    'grant_type': 'account_credentials',
                    'account_id': process.env.ZOOM_ACCOUNT_ID
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`
                }
            }
            try {
                const result = await axios(config);
                token = result.data.access_token;
            } catch (error) {
                logger.error(`ERROR WHILE Getting THE TOKEN FROM THE ZOOM AUTHENTICATION SERVER ${error.message}`);
                logger.error(error);
                throw new Error("Error Occured On get token function ");
            }
        }

        return token;
    };

    return {
        getToken,
        refresh: async () => await getToken(true)
    }

})();

const scheduleAMeeting = async (body) => {
    try {
        const token = await JwtAuth.getToken();
        const meetingInvitees = [];
        body.students.forEach((student) => {
            meetingInvitees.push({
                email: student
            })
        });
        const config = {
            method: "post",
            url: `${process.env.ZOOM_API_BASE_URL}/users/${body.teacher}/meetings`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: {
                start_time: body.startTime,
                meeting_invitees: meetingInvitees,
                timezone: 'Asia/Calcutta'
            }
        }
        const response = await axios(config);
        console.log(`The zoom API response is ${response.data}`);
        return response.data;
    } catch (error) {
        logger.error("Error Occured on schedule Meeting Function", error);
        throw new Error(error.message);
    }
}

module.exports = {
    scheduleAMeeting
}