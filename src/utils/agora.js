import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;

export const generateAgoraToken = ({
  channelName,
  uid = 0,
  role = "publisher",
  expireSeconds = 3600,
}) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error("Agora App ID/Certificate missing in env");
  }

  const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const now = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = now + expireSeconds;

  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    agoraRole,
    privilegeExpireTime
  );
};