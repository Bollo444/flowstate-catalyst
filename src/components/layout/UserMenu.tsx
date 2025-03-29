"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/lib/supabaseClient";
import { styled } from "@emotion/react";
import styles from "./UserMenu.module.css";

const MenuContainer = styled.div`
  // your styles
`;

export function UserMenu() {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={styles.userMenu}>
      <button className={styles.menuTrigger} onClick={() => setIsOpen(!isOpen)}>
        {session.user.user_metadata.avatar_url ? (
          <Image
            src={session.user.user_metadata.avatar_url}
            alt="User avatar"
            width={32}
            height={32}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {session.user.email?.[0].toUpperCase() || "?"}
          </div>
        )}
        <span className={styles.userName}>
          {session.user.user_metadata.full_name || session.user.email}
        </span>
      </button>

      {isOpen && (
        <div className={styles.menuContent}>
          <div className={styles.menuHeader}>
            <span className={styles.email}>{session.user.email}</span>
          </div>

          <div className={styles.menuItems}>
            <Link
              href="/profile"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>

            <button
              onClick={handleSignOut}
              className={`${styles.menuItem} ${styles.signOut}`}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
