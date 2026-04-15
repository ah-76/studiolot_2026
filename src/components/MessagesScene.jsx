import { messageThreads, notificationFeed } from "../data/studiolotData";
import { SceneCopyPanel } from "./SceneCopyPanel";

export function MessagesScene({ scene }) {
  return (
    <div className="scene scene--messages">
      <SceneCopyPanel {...scene} />

      <section className="messages-stage">
        <div className="messages-stage__panels">
          <div className="messages-panel">
            <h3 className="messages-panel__title">Messages</h3>
            {messageThreads.map((thread) => (
              <article className="thread-card" key={thread.id}>
                <div className="thread-card__header">
                  <h3>{thread.title}</h3>
                  <span>{thread.timestamp}</span>
                </div>
                <p>{thread.message}</p>
              </article>
            ))}
          </div>

          <div className="messages-panel">
            <h3 className="messages-panel__title">Notifications</h3>
            <div className="notification-feed">
              {notificationFeed.map((item) => (
                <div className="notification-feed__item" key={item}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
