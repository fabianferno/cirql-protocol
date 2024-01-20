import { ConversationModel } from "../models/Conversation";
import { Notification } from "@big-whale-labs/botcaster";
import { SeenCastModel } from "../models/SeenCast";
import attestForUser from "./eas";
import chatgpt from "./chatgpt";
import env from "./env";
import publishCast from "./publishCast";

function delay(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export default async function handleNotification(
  notification: Notification,
  mnemonic: string
) {
  let castHash: string | undefined;
  try {
    // Check if mention
    if (
      notification.type !== "cast-mention" &&
      notification.type !== "cast-reply"
    ) {
      return;
    }
    // Check if it's a self-notification
    if (notification.actor?.username?.toLowerCase() === env.BOT_FNAME) {
      return;
    }

    // Check if it has text
    const mentionText = notification.content.cast?.text;
    if (!mentionText) {
      return;
    }
    // Check if it has a hash
    if (!notification.content.cast?.hash) {
      return;
    }
    castHash = notification.content.cast.hash as string;
    // Check if there is an actor
    if (!notification.actor) {
      return;
    }
    // Get thread hash
    const threadHash =
      notification.content.cast?.threadHash || notification.content.cast.hash;
    // Check if we've seen this notification
    const dbCast = await SeenCastModel.findOne({
      hash: notification.content.cast.hash,
    });
    if (dbCast) {
      return;
    }
    await SeenCastModel.create({
      hash: notification.content.cast.hash,
    });
    if (
      notification.content.cast.timestamp <
      Date.now() - 1000 * 60 * 60 * 24
    ) {
      return;
    }

    // Check if its not an attestation request
    if (!mentionText.toLowerCase().includes("/attest")) {
      return;
    }

    // Clean up text
    let bot_prompt = mentionText.replace("/test", "").trim();

    console.log("bot_prompt", bot_prompt);

    // Get response
    const conversation = await ConversationModel.findOne({
      threadHash,
    });

    let { text: openaiResponse, id: messageId } = await chatgpt.sendMessage(
      `Extract the following information from the message
      Do something here
      If some information is missing, return null for that key.

   Here is the message: "${bot_prompt}"`,
      {
        parentMessageId: conversation?.currentParentMessageId,
      }
    );

    await ConversationModel.updateOne(
      {
        threadHash,
      },
      {
        currentParentMessageId: messageId,
      },
      {
        upsert: true,
      }
    );

    // Convert response to JSON
    let parsedResponse: any = {};
    try {
      parsedResponse = JSON.parse(openaiResponse);
    } catch (error) {
      console.log(error);
    }

    console.log(messageId);
    console.log("======");
    console.log("threadHash", threadHash);

    // let attestationPayload = {
    //   userAFid: notification?.actor?.username || "",
    //   userBFid: parsedResponse?.userMentioned || "",
    //   entityId: parsedResponse?.entityId || "",
    //   action: parsedResponse?.action || "",
    //   misc: JSON.stringify({
    //     threadHash,
    //     ...parsedResponse?.misc,
    //   }),
    // };

    // // Attest for user
    // const attestationUUID = await attestForUser(
    //   mnemonic, // mnemonic
    //   attestationPayload
    // );

    // let reply = `${attestationPayload.userAFid} -> ${attestationPayload.userBFid} | Prop/Feature Id: ${attestationPayload.entityId} | Action: ${attestationPayload.action}.\n
    // On-chain attestation record created for this. You can view it here: https://polygon-mumbai.easscan.org/attestation/view/${attestationUUID}`;
    let reply = `I'm sorry, I'm not ready yet. I'm still learning. Try again later.`;
    console.log("reply", reply);

    if (reply.length <= 320) {
      return publishCast(reply, notification.content.cast.hash, mnemonic);
    } else {
      return publishCast(
        "Sorry, I couldn't understand your response. Try again later.",
        castHash,
        mnemonic
      );
    }
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    if (castHash) {
      const errorMessage = error instanceof Error ? error.message : error;
      if (`${errorMessage}`.includes("127.0.0.1:27017")) {
        return;
      }
      return publishCast(
        `So sorry, I experienced an error, try again later: ${
          error instanceof Error ? error.message : error
        }`.substring(0, 320),
        castHash,
        mnemonic
      );
    }
  }
}
