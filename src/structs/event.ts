import { ClientEvents } from "discord.js";

class Event<T extends keyof ClientEvents> {
  public constructor(
    public name: T,
    public callback: (...args: ClientEvents[T]) => unknown
  ) {}
}

export { Event };
