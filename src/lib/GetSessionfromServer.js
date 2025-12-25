const { authOptions } = require("@/app/api/auth/[...nextauth]/route");
const { getServerSession } = require("next-auth");

export const GetSessionFromServer = async () => {
    const session = await getServerSession(authOptions);
    return session
}