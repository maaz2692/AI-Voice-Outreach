import Link from "next/link";
import styles from "./Sidebar.module.scss";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Contacts",
    href: "#contacts",
  },
  {
    label: "Scripts",
    href: "#scripts",
  },
  {
    label: "Calls",
    href: "#calls",
  },
  {
    label: "Analytics",
    href: "#analytics",
  },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>V</div>

        <div>
          <p className={styles.brandName}>Voice Outreach</p>
          <p className={styles.brandSubtitle}>AI Call Dashboard</p>
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`${styles.menuItem} ${
                  index === 0 ? styles.active : ""
                }`}
              >
                <span className={styles.menuDot} />

                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <p>Mock workflow</p>
        <span>Development mode</span>
      </div>
    </aside>
  );
}