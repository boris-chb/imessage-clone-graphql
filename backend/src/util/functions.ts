import { ParticipantPopulated } from "src/types/conversation";

export function userIsConversationParticipant(
  participants: ParticipantPopulated[],
  userId: string
) {
  return !!participants.find((participant) => participant.userId === userId);
}
