export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
    const cookieExpiresInDays = Number(process.env.COOKIE_EXPIRES) || 7;
    const responseUser = user.toObject();
    delete responseUser.password;

    res.status(statusCode).cookie(cookieName, token, {
        expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    }).json({
        success: true,
        message,
        user: responseUser,
        token,
    });
};
