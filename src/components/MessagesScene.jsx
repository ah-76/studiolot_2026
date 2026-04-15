import { messageThreads, notificationFeed } from "../data/studiolotData";
import { SceneCopyPanel } from "./SceneCopyPanel";

export function MessagesScene({ scene }) {
  return (
    <div className="scene scene--messages">
      <SceneCopyPanel {...scene} />

      <section className="messages-stage">
        <div className="messages-stage__hero">
          <img src={scene.asset} alt="Messages and notifications concept art" />
        </div>

        <div className="messages-stage__panels">
          <div className="messages-panel">
            <p className="messages-panel__kicker">Active Threads</p>
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
            <p className="messages-panel__kicker">Notification Feed</p>
            <div className="notification-feed">
              {notificationFeed.map((item) => (
                <div className="notification-feed__item" key={item}>
                  <span className="notification-feed__dot" />
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
