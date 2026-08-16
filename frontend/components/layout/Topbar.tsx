import styles from "./Topbar.module.scss";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage outreach contacts and AI call workflows.
        </p>
      </div>

      <div className={styles.modeBadge}>
        <span className={styles.statusDot} />
        Mock Voice Mode
      </div>
    </header>
  );
}