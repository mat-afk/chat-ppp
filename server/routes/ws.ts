import type { Peer } from "crossws";
import { connections } from "../global/clients";

export default defineWebSocketHandler({
  open(peer) {
    const userId = new URL(peer.websocket.url!).searchParams.get("userId");

    if (!userId) return;

    connections.set(userId, peer as unknown as Peer);

    console.log(
      `[ws] a user with id ${userId} connected with socket ${peer.id}`
    );
    console.log(
      "[ws] connected peers: " + connections.keys().toArray().join(", ")
    );
  },
  close(peer) {
    let userId: string | undefined;

    connections.forEach((value, key) => {
      if (value.id === peer.id) {
        userId = key;
      }
    });

    if (userId) {
      connections.delete(userId);
    }
  },
});
